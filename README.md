# Bonus Class Booker

O **Bonus Class Booker** é um sistema desenvolvido para facilitar o agendamento de aulas extras às sextas-feiras por alunos, com base na disponibilidade de professores. Ele oferece uma interface amigável para os alunos visualizarem e reservarem horários disponíveis, além de fornecer notificações de confirmação e lembretes. Os coordenadores, por sua vez, gerenciam a disponibilidade dos professores e os agendamentos através de uma planilha integrada ao Google Sheets.

Este README detalha o propósito do projeto, suas funcionalidades, a estrutura do código, instruções de configuração e uso, além de informações adicionais como melhorias futuras e licença.

## Índice

- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Instalação](#configuração-e-instalação)
- [Como Funciona](#como-funciona)
- [Notificações](#notificações)
- [To-Do e Melhorias Futuras](#to-do-e-melhorias-futuras)
- [Licença](#licença)

---

## Funcionalidades

O sistema foi projetado com funcionalidades específicas para dois tipos de usuários: **alunos** e **coordenadores**. Aqui está uma visão detalhada de cada uma:

### Para Alunos
- **Visualização de Horários Disponíveis:** Os alunos podem consultar os horários livres com base na disponibilidade dos professores, filtrados por modalidade (online ou presencial).
- **Agendamento de Aulas:** Após selecionar um horário, o aluno preenche um formulário com informações como nome, livro, conteúdo a ser abordado, modalidade desejada e número de WhatsApp.
- **Notificações:** O sistema envia confirmações de agendamento e lembretes automáticos via navegador.
- **Escolha de Modalidade:** Os alunos podem optar por aulas online ou presenciais, e o sistema exibe apenas os horários compatíveis com a escolha.

### Para Coordenadores
- **Gestão de Disponibilidade:** Os coordenadores definem os horários disponíveis dos professores diretamente na planilha do Google Sheets.
- **Gerenciamento de Agendamentos:** Podem visualizar e ajustar os agendamentos realizados pelos alunos na mesma planilha.
- **Flexibilidade de Modalidade:** Cada slot de horário pode ser configurado como online ("O"), presencial ("P") ou ambas (deixando em branco).

---

## Estrutura do Projeto

O projeto é dividido em duas partes principais: **backend** e **frontend**, cada uma com sua própria estrutura de pastas e arquivos. Abaixo está a organização detalhada do repositório:

```
bonus-class-booker/
├── backend/                    # Contém o código do servidor (Node.js com Express)
│   ├── controllers/           # Lógica para interagir com a planilha do Google Sheets
│   │   └── sheetController.js # Controlador com funções para leitura e escrita na planilha
│   ├── routes/                # Definição das rotas da API
│   │   └── bonusClassRoutes.js # Rotas específicas para consulta de disponibilidade e agendamento
│   ├── services/              # Serviços reutilizáveis para integração com o Google Sheets
│   │   └── googleSheetsService.js # Funções para autenticação e operações na API do Google Sheets
│   ├── .env                   # Arquivo de variáveis de ambiente (não versionado)
│   ├── app.js                 # Configuração do servidor Express e middlewares
│   ├── server.js              # Ponto de entrada que inicializa o servidor
│   └── package.json           # Dependências e scripts do backend
│
├── frontend/                  # Contém a interface do usuário (React.js)
│   ├── public/                # Arquivos estáticos acessíveis publicamente
│   │   ├── index.html         # Template HTML principal
│   │   └── favicon.ico        # Ícone da aplicação
│   ├── src/                   # Código-fonte do frontend
│   │   ├── components/        # Componentes React reutilizáveis
│   │   │   ├── AvailableSlots.js # Exibe os horários disponíveis em uma lista ou tabela
│   │   │   ├── BookingForm.js   # Formulário para o aluno realizar o agendamento
│   │   │   └── Notification.js  # Componente para exibir notificações no navegador
│   │   ├── services/          # Funções para comunicação com o backend
│   │   │   └── apiService.js  # Requisições HTTP para as rotas do backend
│   │   ├── App.js             # Componente raiz da aplicação React
│   │   ├── index.js           # Ponto de entrada que renderiza o React no DOM
│   │   └── styles.css         # Estilos globais da aplicação
│   ├── .env                   # Variáveis de ambiente do frontend (opcional, não versionado)
│   └── package.json           # Dependências e scripts do frontend
│
└── README.md                  # Este arquivo de documentação
```

### Detalhamento dos Arquivos

#### Backend
- **`controllers/sheetController.js`:** Contém funções como `getAvailableSlots` (para listar horários disponíveis) e `bookSlot` (para registrar um agendamento). Essas funções utilizam o `googleSheetsService.js` para interagir com a planilha.
- **`routes/bonusClassRoutes.js`:** Define as rotas da API, como `GET /bonus-class/available` (retorna horários disponíveis) e `POST /bonus-class/book` (processa agendamentos).
- **`services/googleSheetsService.js`:** Implementa a autenticação com a API do Google Sheets e métodos como `readSheet` e `writeSheet` para manipular os dados da planilha.
- **`app.js`:** Configura o Express, adiciona middlewares (ex.: `body-parser` para processar JSON) e registra as rotas.
- **`server.js`:** Inicializa o servidor na porta especificada (padrão: 5000).
- **`.env`:** Armazena credenciais sensíveis, como `GOOGLE_SHEET_ID` e `GOOGLE_API_KEY`.

#### Frontend
- **`components/AvailableSlots.js`:** Renderiza uma lista ou tabela de horários disponíveis, permitindo ao aluno selecionar um slot.
- **`components/BookingForm.js`:** Exibe um formulário com campos para nome, livro, conteúdo, modalidade e WhatsApp, enviando os dados ao backend via `apiService.js`.
- **`components/Notification.js`:** Gerencia notificações no navegador usando a API de Notificações do HTML5.
- **`services/apiService.js`:** Contém funções como `fetchAvailableSlots` e `submitBooking` para fazer requisições ao backend.
- **`App.js`:** Componente principal que coordena os outros componentes e mantém o estado da aplicação.
- **`index.js`:** Configura o React e renderiza o `App.js` no elemento raiz do `index.html`.

---

## Configuração e Instalação

Para executar o **Bonus Class Booker** localmente, siga os passos abaixo. O processo é dividido em configuração do backend e do frontend.

### Pré-requisitos
- **Node.js** (versão 16 ou superior recomendada) e **npm** instalados.
- Uma conta no **Google Cloud** com a API do Google Sheets habilitada e credenciais geradas.
- Uma planilha no **Google Sheets** configurada com as seguintes colunas:
  - `TEACHER` (nome do professor)
  - `HORARIO` (ex.: "14:00 - 14:30")
  - `MODALIDADE` ("O" para online, "P" para presencial, ou em branco para ambas)
  - `ALUNO` (nome do aluno, em branco se disponível)
  - `LIVRO` (livro informado pelo aluno)
  - `CONTEUDO` (conteúdo solicitado)
  - `WHATSAPP` (número do aluno)

### Backend

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/bonus-class-booker.git
   cd bonus-class-booker/backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

   Isso instalará pacotes como `express`, `googleapis` (para integração com Google Sheets) e outros listados no `package.json`.

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:
     ```
     GOOGLE_SHEET_ID=seu-id-da-planilha
     GOOGLE_API_KEY=sua-chave-da-api
     PORT=5000
     ```
   - Para obter as credenciais, siga o [guia oficial da API do Google Sheets](https://developers.google.com/sheets/api/quickstart/nodejs).

4. **Inicie o servidor:**

   ```bash
   npm start
   ```

### Frontend

1. **Navegue até a pasta do frontend:**

   ```bash
   cd ../frontend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

   Isso instalará o `react`, `react-dom`, `axios` (para chamadas HTTP) e outras dependências.

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   ```

   A aplicação React será aberta automaticamente em `http://localhost:3000`.

### Deploy
- **Backend:** Hospede em plataformas como **Railway**, **Heroku** ou **Vercel**. Configure as variáveis de ambiente no painel da plataforma.
- **Frontend:** Pode ser hospedado no **Netlify**, **Vercel** ou similares. Certifique-se de ajustar a URL do backend no `apiService.js` para apontar para o servidor deployado.

---

## Como Funciona

### Google Sheets como Banco de Dados
A planilha do Google Sheets serve como o "banco de dados" do sistema. Cada linha representa um slot de horário, e as colunas armazenam informações específicas. O backend lê e escreve diretamente na planilha via API.

#### Exemplo de Planilha
| TEACHER    | HORARIO       | MODALIDADE | ALUNO     | LIVRO        | CONTEUDO         | WHATSAPP     |
|------------|---------------|------------|-----------|--------------|------------------|--------------|
| Prof. Ana  | 14:00 - 14:30 | O          |           |              |                  |              |
| Prof. João | 15:00 - 15:30 | P          | Maria     | English 1    | Grammar          | 11987654321  |
| Prof. Ana  | 16:00 - 16:30 |            |           |              |                  |              |

- Slots sem `ALUNO` são considerados disponíveis.
- `MODALIDADE` em branco indica que o slot aceita tanto online quanto presencial.

### Backend (Node.js com Express)
- **`GET /bonus-class/available`:** Lê a planilha, filtra os slots disponíveis (sem aluno) e retorna uma lista JSON com base na modalidade solicitada pelo aluno.
- **`POST /bonus-class/book`:** Recebe os dados do formulário, verifica se o aluno já tem um agendamento (limpando-o se necessário), e atualiza a planilha com o novo agendamento.

### Frontend (React.js)
- O aluno seleciona a modalidade no início.
- O componente `AvailableSlots.js` faz uma chamada ao backend para exibir os horários disponíveis.
- Após escolher um slot, o `BookingForm.js` coleta os dados e envia ao backend via POST.
- O `Notification.js` exibe mensagens ao usuário após o agendamento.

---

## Notificações
- **Confirmação:** Após o agendamento, uma notificação no navegador exibe detalhes como horário, modalidade e a política de multa ($20 por cancelamento ou falta).
- **Lembretes:** 
  - Um dia antes da aula (24 horas).
  - Duas horas antes do horário agendado.
- As notificações utilizam a API de Notificações do navegador e requerem permissão do usuário.

---

## To-Do e Melhorias Futuras
- **Autenticação:** Implementar login para alunos, garantindo que apenas usuários autorizados façam agendamentos.
- **Interface para Coordenadores:** Criar um painel web para gerenciar a planilha sem depender do Google Sheets diretamente.
- **Validação Avançada:** Adicionar verificações mais robustas no frontend (ex.: formato de WhatsApp).
- **Pagamento de Multa:** Integrar um sistema como Stripe ou PagSeguro para processar multas por cancelamentos.
- **Visualização de Calendário:** Substituir a lista de horários por um calendário interativo.

---

## Licença
Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
