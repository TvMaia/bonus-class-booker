const { google } = require('googleapis');
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Função para obter horários únicos disponíveis
const getAvailableSlots = async (modality) => {
  const client = await auth.getClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Sheet1!A:G';
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];
    const modalityCode = modality === 'online' ? 'O' : modality === 'presencial' ? 'P' : '';
    const availableSlots = rows
      .map((row, index) => ({
        row,
        index,
        horario: row[1], // Coluna B: HORARIO
        modalidade: row[2], // Coluna C: MODALIDADE
        aluno: row[3], // Coluna D: ALUNO
      }))
      .filter(({ aluno, modalidade }) => !aluno && (modalidade === modalityCode || !modalidade))
      .map(({ horario }) => horario);

    // Remover duplicatas
    const uniqueSlots = [...new Set(availableSlots)];
    return uniqueSlots;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

// Função para agendar na primeira linha disponível com base em horario e modality
const bookSlot = async ({ horario, modality, studentName, book, content, whatsapp }) => {
  const client = await auth.getClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Sheet1!A:G';
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];
    const modalityCode = modality === 'online' ? 'O' : modality === 'presencial' ? 'P' : '';

    // Encontrar a primeira linha disponível
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === horario &&
        (row[2] === modalityCode || !row[2]) &&
        !row[3]
    );

    if (rowIndex === -1) {
      throw new Error('Nenhuma linha disponível para o horário e modalidade selecionados');
    }

    // Verificar e preencher a modalidade se estiver em branco
    if (!rows[rowIndex][2]) {
      rows[rowIndex][2] = modalityCode;
    }

    // Preparar os valores para atualização (colunas C:G)
    const updateValues = [[
      rows[rowIndex][2], // Coluna C: MODALIDADE
      studentName,       // Coluna D: ALUNO
      book || '',        // Coluna E: LIVRO
      content || '',     // Coluna F: CONTEÚDO
      whatsapp || ''     // Coluna G: WHATSAPP
    ]];

    // Atualizar a linha (agora de C até G)
    const updateRange = `Sheet1!C${rowIndex + 1}:G${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      resource: { values: updateValues },
    });

    console.log('Agendamento realizado com sucesso');
  } catch (error) {
    console.error('Erro ao agendar:', error);
    throw error;
  }
};

module.exports = { getAvailableSlots, bookSlot };