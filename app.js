const fronts=['Cerimônia e cortejo','Decoração da igreja','Decoração da recepção','Buffet e alimentação','Bebidas','Locações e equipamentos','Bolo e doces','Estrutura do local','Equipe familiar','Cronograma e orçamento','Preparativos da Noiva','Preparativos do Noivo'];
const lists=[
['Confirmar padrinhos, pais e crianças do cortejo','Definir ordem de entrada e saída','Confirmar quem levará as alianças','Finalizar o porta-alianças','Definir músicas da cerimônia','Confirmar celebrante','Definir responsável pelo cortejo','Agendar ensaio de entrada e saída'],
['Conferir flores e folhagens compradas','Definir arranjos do altar e das fileiras','Confirmar decoração da entrada','Conferir vasos e suportes','Comprar materiais de fixação','Definir responsáveis pela montagem','Confirmar horários de montagem e retirada'],
['Definir disposição das mesas dos convidados','Confirmar decoração das mesas','Organizar espaço do bolo','Planejar instalação das cortinas e LED já disponíveis','Definir painel para fotografias','Confirmar cobertura em caso de chuva','Definir equipe de montagem e desmontagem'],
['Confirmar fornecedor dos 400 salgadinhos','Definir quem preparará o jantar','Confirmar cozinha e equipamentos disponíveis','Organizar compra dos ingredientes','Definir preparo e conservação dos alimentos','Definir responsáveis pela reposição','Organizar serviço self-service'],
['Definir sabores dos refrigerantes (30 L)','Definir sabores e preparo dos sucos (20 L)','Comprar água mineral (30 L)','Providenciar gelo (20 a 25 kg)','Confirmar caixas térmicas e jarras','Definir responsável pelo serviço das bebidas'],
['Confirmar mesas e cadeiras','Confirmar toalhas das mesas','Fechar aluguel das louças e talheres','Alugar 3 réchauds com cubas e tampas','Confirmar utensílios de servir','Confirmar bandejas e travessas','Definir entrega, retirada e devolução'],
['Confirmar responsável pelo bolo','Definir sabor, tamanho e quantidade','Confirmar se haverá docinhos','Definir horário do corte do bolo','Confirmar utensílios para servir','Planejar conservação do bolo'],
['Verificar iluminação da recepção','Conferir pontos de energia','Verificar extensões e instalações do LED','Confirmar proteção contra chuva','Organizar circulação entre cozinha e buffet','Conferir banheiros e materiais de higiene','Definir local de descarte do lixo'],
['Definir coordenador geral','Definir responsáveis pela cerimônia','Definir responsáveis pela decoração','Definir responsáveis pelo preparo do jantar','Definir responsáveis pelo buffet e bebidas','Definir responsáveis pelo recolhimento de louças','Definir responsáveis pela desmontagem'],
['Consolidar orçamento geral','Definir responsáveis pelos pagamentos','Estabelecer datas das compras','Confirmar horários dos fornecedores','Organizar montagem na véspera','Elaborar programação do dia','Confirmar horário de encerramento','Organizar devolução dos materiais alugados']
];
const defaultTasks=lists.flatMap((arr,i)=>arr.map((title,j)=>({id:`seed-${i}-${j}`,title,front:fronts[i],owner:'',due:'',status:'Pendente',notes:''})));
const $=id=>document.getElementById(id);let tasks=[], editing=null, remote=false, db=null, auth=null, user=null, unsub=null, accessReady=false;const storeKey='casamento-tarefas-v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(storeKey))||defaultTasks}catch{return defaultTasks}};tasks=[];
function persist(){}
const frontIcons=['💍','⛪','🌿','🍽️','🥤','🪑','🎂','🏛️','👨‍👩‍👧‍👦','📅','👰','🤵'];
function renderFrontCards(){const current=$('frontFilter').value;const container=$('frontCards');container.replaceChildren();fronts.forEach((front,i)=>{const all=tasks.filter(t=>t.front===front);const done=all.filter(t=>t.status==='Concluída').length;const card=document.createElement('button');card.type='button';card.className='front-card'+(current===front?' selected':'');card.setAttribute('aria-pressed',String(current===front));const icon=document.createElement('span');icon.className='front-icon';icon.textContent=frontIcons[i];icon.setAttribute('aria-hidden','true');const name=document.createElement('strong');name.textContent=front;const count=document.createElement('span');count.className='front-count';count.textContent=`${done} de ${all.length} concluídas`;const progress=document.createElement('span');progress.className='front-progress';const fill=document.createElement('span');fill.style.width=(all.length?done/all.length*100:0)+'%';progress.append(fill);card.append(icon,name,count,progress);card.onclick=()=>{$('frontFilter').value=current===front?'':front;render();$('groups').scrollIntoView({behavior:'smooth',block:'start'})};container.append(card)});$('showAllFronts').hidden=!current;}
function renderOverview(){const host=$('overviewRows');host.replaceChildren();$('overviewTotal').textContent=`${tasks.length} atividades no total`;for(let i=0;i<fronts.length;i++){const front=fronts[i],items=tasks.filter(t=>t.front===front),done=items.filter(t=>t.status==='Concluída').length,late=items.filter(t=>t.due&&t.due<new Date().toISOString().slice(0,10)&&t.status!=='Concluída').length,pct=items.length?Math.round(done/items.length*100):0;const row=document.createElement('button');row.type='button';row.className='overview-row';row.setAttribute('aria-label',`${front}: ${done} de ${items.length} concluídas. Ver atividades.`);const label=document.createElement('span');label.className='overview-label';label.textContent=frontIcons[i]+' '+front;const track=document.createElement('span');track.className='overview-track';const fill=document.createElement('span');fill.style.width=pct+'%';track.append(fill);const score=document.createElement('span');score.className='overview-score';score.textContent=`${done}/${items.length} · ${pct}%`+(late?` · ${late} atrasada${late>1?'s':''}`:'');row.append(label,track,score);row.onclick=()=>{$('frontFilter').value=front;render();$('groups').scrollIntoView({behavior:'smooth',block:'start'})};host.append(row)}}
$('showAllFronts').onclick=()=>{$('frontFilter').value='';render()};
function render(){renderFrontCards();renderOverview();const search=$('search').value.toLocaleLowerCase('pt-BR'),ff=$('frontFilter').value,sf=$('statusFilter').value;const done=tasks.filter(t=>t.status==='Concluída').length,late=tasks.filter(t=>t.due&&t.due<new Date().toISOString().slice(0,10)&&t.status!=='Concluída').length;$('progress').textContent=(tasks.length?Math.round(done/tasks.length*100):0)+'%';$('done').textContent=done;$('pending').textContent=tasks.length-done;$('late').textContent=late;$('bar').style.width=(tasks.length?done/tasks.length*100:0)+'%';const host=$('groups');host.replaceChildren();for(const front of fronts){if(ff&&ff!==front)continue;const all=tasks.filter(t=>t.front===front),visible=all.filter(t=>(!sf||t.status===sf)&&(`${t.title} ${t.owner} ${t.notes}`.toLocaleLowerCase('pt-BR').includes(search)));if(!visible.length&&(ff||sf||search))continue;const section=document.createElement('section');section.className='group';const head=document.createElement('div');head.className='grouphead';const heading=document.createElement('h2');heading.textContent=front;const meta=document.createElement('span');meta.className='muted';meta.textContent=`${all.filter(t=>t.status==='Concluída').length}/${all.length} concluídas · ${visible.length} exibidas`;head.append(heading,meta);const list=document.createElement('div');list.className='tasks';for(const t of visible){const item=document.createElement('div');item.className='task'+(t.status==='Concluída'?' completed':'');const ck=document.createElement('input');ck.type='checkbox';ck.checked=t.status==='Concluída';ck.setAttribute('aria-label','Concluir '+t.title);ck.onchange=()=>update({...t,status:ck.checked?'Concluída':(t.status==='Concluída'?'Pendente':t.status)});const detail=document.createElement('div');const title=document.createElement('h3');title.textContent=t.title;const metaLine=document.createElement('div');metaLine.className='meta';const owner=document.createElement('span');owner.textContent='👤 '+(t.owner||'Sem responsável');const date=document.createElement('span');date.textContent='📅 '+(t.due?t.due.split('-').reverse().join('/'):'Sem prazo');const tag=document.createElement('span');tag.className='tag'+(t.status==='Concluída'?' done':t.status==='Agendada'?' scheduled':t.due&&t.due<new Date().toISOString().slice(0,10)?' late':'');tag.textContent=t.status;metaLine.append(owner,date,tag);detail.append(title,metaLine);if(t.notes){const note=document.createElement('div');note.className='muted';note.textContent=t.notes;detail.append(note)}const edit=document.createElement('button');edit.className='edit';edit.textContent='Editar';edit.onclick=()=>openEditor(t);item.append(ck,detail,edit);list.append(item)}if(!visible.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='Nenhuma tarefa nesta frente.';list.append(empty)}head.onclick=()=>list.hidden=!list.hidden;section.append(head,list);host.append(section)}}
function openEditor(t=null){editing=t?.id||null;$('dialogTitle').textContent=t?'Editar tarefa':'Nova tarefa';const f=$('taskForm');f.elements.title.value=t?.title||'';f.elements.front.value=t?.front||fronts[0];f.elements.owner.value=t?.owner||'';f.elements.due.value=t?.due||'';f.elements.status.value=t?.status||'Pendente';f.elements.notes.value=t?.notes||'';$('deleteBtn').hidden=!t;$('editor').showModal()}
let setDocFn=null,deleteDocFn=null,docFn=null,colFn=null,getDocFn=null,memberUnsub=null,isAdmin=false,adminEmail="";
async function update(t){if(!remote){alert('Entre com uma conta autorizada para editar.');return}if(remote){try{await setDocFn(docFn(db,'casamentos','principal','tarefas',t.id),t)}catch(e){alert('Não foi possível salvar: '+e.message)}}else{tasks=tasks.filter(x=>x.id!==t.id).concat(t);persist();render()}}
async function remove(id){if(!remote){alert('Entre com uma conta autorizada para excluir.');return}if(remote){try{await deleteDocFn(docFn(db,'casamentos','principal','tarefas',id))}catch(e){alert(e.message)}}else{tasks=tasks.filter(t=>t.id!==id);persist();render()}}
for(const front of fronts){for(const select of [$('frontFilter'),$('editFront')]){const o=document.createElement('option');o.value=front;o.textContent=front;select.append(o)}}
$('search').oninput=render;$('frontFilter').onchange=render;$('statusFilter').onchange=render;$('addBtn').onclick=()=>{if(remote)openEditor()};$('cancelBtn').onclick=()=>$('editor').close();$('deleteBtn').onclick=async()=>{if(editing&&confirm('Excluir esta tarefa?')){await remove(editing);$('editor').close()}};
$('taskForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget.elements;const id=editing||crypto.randomUUID();await update({id,title:f.title.value.trim(),front:f.front.value,owner:f.owner.value.trim(),due:f.due.value,status:f.status.value,notes:f.notes.value.trim()});$('editor').close()};
$('exportBtn').onclick=()=>{if(!remote)return;const b=new Blob([JSON.stringify(tasks,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='casamento-backup.json';a.click();URL.revokeObjectURL(a.href)};
$('importBtn').onclick=()=>{if(remote)$('importFile').click()};$('importFile').onchange=async e=>{if(!remote)return;try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data)||!data.every(t=>t.id&&t.title&&fronts.includes(t.front)))throw Error('Arquivo inválido');if(!confirm('Importar tarefas? No modo online, isso adicionará/atualizará os registros do arquivo.'))return;for(const t of data)await update(t);render()}catch(err){alert(err.message)}e.target.value=''};
function showGate(message, loginEnabled=false){
  $('privateContent').hidden=true;
  $('accessGate').hidden=false;
  $('gateMessage').textContent=message;
  $('gateLoginBtn').hidden=!loginEnabled;
}
function showApp(email){
  $('privateContent').hidden=false;
  $('accessGate').hidden=true;
  $('userEmail').hidden=false;
  $('userEmail').textContent=email;
}
showGate('Verificando a conexão segura com o Firebase...');
if(window.FIREBASE_CONFIG?.apiKey){
 try{
  const base='https://www.gstatic.com/firebasejs/10.14.1/';
  const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,setPersistence,browserLocalPersistence},{getFirestore,collection,doc,setDoc,deleteDoc,getDoc,onSnapshot}]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
  const app=initializeApp(window.FIREBASE_CONFIG);
  auth=getAuth(app); db=getFirestore(app);
  setDocFn=setDoc;deleteDocFn=deleteDoc;docFn=doc;colFn=collection;getDocFn=getDoc;
  await setPersistence(auth,browserLocalPersistence);
  const login=()=>signInWithPopup(auth,new GoogleAuthProvider()).catch(e=>alert('Não foi possível entrar: '+e.message));
  $('loginBtn').onclick=login;$('gateLoginBtn').onclick=login;
  $('logoutBtn').onclick=async()=>{try{await signOut(auth)}catch(e){alert('Não foi possível sair: '+e.message)}};
  onAuthStateChanged(auth,u=>{
   if(unsub){unsub();unsub=null}if(memberUnsub){memberUnsub();memberUnsub=null}isAdmin=false;$("accessBtn").hidden=true;$("accessDialog").close?.();
   user=u;remote=false;tasks=[];render();
   $('loginBtn').hidden=!!u;$('logoutBtn').hidden=!u;
   $('userEmail').hidden=!u;
   $('userEmail').textContent=u?.email||'';
   if(!u){$('syncStatus').textContent='Não conectado';showGate('Entre com uma conta Google autorizada para acessar as tarefas.',true);return}
   $('syncStatus').textContent='Verificando permissão...';
   getDoc(doc(db,'casamentos','principal','config','administracao')).then(snap=>{if(user?.uid!==u.uid)return;adminEmail=(snap.data()?.adminEmail||'').toLowerCase();isAdmin=adminEmail===u.email?.toLowerCase();$('accessBtn').hidden=!isAdmin;}).catch(()=>{});
   showGate('Validando seu acesso ao checklist compartilhado...');
   unsub=onSnapshot(collection(db,'casamentos','principal','tarefas'),snap=>{
    remote=true;tasks=snap.docs.map(d=>d.data());render();
    $('syncStatus').textContent=snap.empty?'Conectado · banco vazio':'Sincronizado';
    showApp(u.email||'Conta Google');
   },e=>{
    remote=false;tasks=[];render();
    $('syncStatus').textContent='Acesso não autorizado';
    showGate(e.code==='permission-denied'?'Esta conta não está autorizada. Solicite ao organizador que inclua seu e-mail nas regras do Firestore.':'Não foi possível acessar as tarefas: '+e.message);
   });
  },e=>showGate('Erro na autenticação: '+e.message,true));
 }catch(e){$('syncStatus').textContent='Erro de configuração';showGate('Falha ao iniciar o Firebase: '+e.message)}
}else{$('syncStatus').textContent='Firebase não configurado';showGate('Configure o arquivo config.js para habilitar o login Google e o acompanhamento compartilhado.')}

// Administração de acessos: os membros são armazenados no Firestore.
$('accessBtn').onclick=()=>{
 if(!isAdmin)return;
 $('accessDialog').showModal();$('memberMessage').textContent='';
 if(memberUnsub)memberUnsub();
 memberUnsub=onMembers();
};
$('closeAccessBtn').onclick=()=>{$('accessDialog').close();if(memberUnsub){memberUnsub();memberUnsub=null}};
function onMembers(){
 // Importações do Firebase são reutilizadas através de carregamento dinâmico.
 let active=true;
 import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js').then(({onSnapshot,collection})=>{
  if(!active)return;
  const stop=onSnapshot(collection(db,'casamentos','principal','membros'),snap=>{
   const host=$('memberList');host.replaceChildren();
   if(snap.empty){const p=document.createElement('p');p.textContent='Nenhum familiar adicionado ainda.';host.append(p)}
   snap.docs.sort((a,b)=>a.id.localeCompare(b.id)).forEach(d=>{
    const line=document.createElement('div');line.className='member-row';
    const email=document.createElement('span');email.textContent=d.id;
    const btn=document.createElement('button');btn.textContent='Remover';btn.className='danger';
    btn.onclick=async()=>{if(!confirm('Remover o acesso de '+d.id+'?'))return;try{await deleteDocFn(docFn(db,'casamentos','principal','membros',d.id));$('memberMessage').textContent='Acesso removido.'}catch(e){$('memberMessage').textContent='Erro: '+e.message}};
    line.append(email,btn);host.append(line);
   });
  },e=>$('memberMessage').textContent='Não foi possível listar acessos: '+e.message);
  const previous=memberUnsub;memberUnsub=()=>{active=false;stop()};
 }).catch(e=>$('memberMessage').textContent=e.message);
 return ()=>{active=false};
}
$('memberForm').onsubmit=async e=>{
 e.preventDefault();if(!isAdmin)return;
 const email=$('memberEmail').value.trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return;
 if(email===adminEmail){$('memberMessage').textContent='A conta administradora já possui acesso.';return}
 try{await setDocFn(docFn(db,'casamentos','principal','membros',email),{email,addedAt:new Date().toISOString()});$('memberEmail').value='';$('memberMessage').textContent='Acesso concedido a '+email}
 catch(err){$('memberMessage').textContent='Não foi possível conceder acesso: '+err.message}
};
