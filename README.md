# Bonus Class Booker (Next.js)

Sistema de agendamento de aulas migrado para Next.js, compatível com deploy serverless no Vercel.

## Instalação
1. Clone o repositório.
2. Rode `npm install` para instalar as dependências.
3. Crie um arquivo `.env` na raiz com:
GOOGLE_SHEET_ID=seu-id-da-planilha
GOOGLE_SHEET_CLIENT_EMAIL=seu-email-de-servico
GOOGLE_SHEET_PRIVATE_KEY="sua-chave-privada"

text

Copiar
4. Rode `npm run dev` para iniciar o servidor local.

## Deploy no Vercel
1. Faça push para o GitHub.
2. Importe o repositório no Vercel.
3. Configure as variáveis de ambiente no painel do Vercel.
4. Faça o deploy.

Acesse o sistema em `http://localhost:3000` (local) ou na URL fornecida pelo Vercel.