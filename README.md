# Organização do casamento — aplicativo colaborativo

Aplicativo responsivo com 10 frentes, tarefas, responsáveis, prazos, status, progresso, filtros e backup JSON.

## Testar sem configurar
Abra `index.html` no navegador. Os dados ficam **somente naquele navegador** (localStorage); não são compartilhados. Pode usar o arquivo `tarefas-iniciais.json` como backup de início.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub (por exemplo `casamento-organizacao`).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Em **Settings > Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/(root)` e salve.
4. O endereço será parecido com `https://SEU-USUARIO.github.io/casamento-organizacao/`.
5. O GitHub Pages publica o site, mas **não sincroniza tarefas sozinho**. Faça as etapas do Firebase abaixo.

## Habilitar sincronização e acesso restrito com Firebase
1. Em https://console.firebase.google.com/ crie um projeto Firebase.
2. Em **Authentication > Sign-in method**, habilite **Google**. Em **Settings > Authorized domains**, adicione `SEU-USUARIO.github.io` (e localhost, se necessário).
3. Em **Firestore Database**, crie o banco em modo produção.
4. Em **Project settings > Your apps**, registre um app Web e copie as propriedades `firebaseConfig` para `config.js`, substituindo `null` por esse objeto. Faça commit dessa alteração no GitHub.
5. Em **Firestore Database > Rules**, substitua as regras pelas do arquivo `firestore.rules`. **Antes de publicar**, edite a lista de e-mails autorizados, substituindo os exemplos pelos e-mails Google dos participantes. Publique as regras.
6. Abra o site publicado e clique **Entrar com Google**. No primeiro acesso, o banco estará vazio: clique **Importar JSON** e escolha `tarefas-iniciais.json`. Faça isso **uma única vez**. A partir daí, todos os participantes autorizados verão as mesmas tarefas em tempo real.
7. Envie o link do site pelo WhatsApp. Cada participante deverá entrar com a conta Google autorizada.

### Segurança e privacidade
- Não use regras públicas como `allow read, write: if true`. A chave de configuração web do Firebase não é uma senha: são as regras do Firestore que protegem os dados.
- Para adicionar/remover pessoas, atualize a lista de e-mails nas regras e publique novamente.
- Qualquer participante autorizado pode editar ou excluir tarefas. Exporte backup JSON periodicamente.
- Para encerrar o projeto após o casamento, remova as permissões de escrita nas regras do Firestore ou desative o site.
- Verifique limites e preços do plano Firebase antes de ativar serviços pagos. Para esse uso pequeno, o plano gratuito costuma bastar, mas não é garantia.
- Este app usa scripts Firebase por CDN e precisa de internet para o modo colaborativo.

## Observações
- Os dados locais de demonstração não são transferidos automaticamente ao Firebase; importe `tarefas-iniciais.json` ao ativar o modo online.
- Não inclua informações sensíveis de convidados, documentos, telefones ou endereços pessoais em tarefas.
