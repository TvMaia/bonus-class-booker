const { google } = require('googleapis');
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

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
    console.log('Linhas brutas da planilha:', rows);
    const modalityCode = modality === 'online' ? 'O' : modality === 'presencial' ? 'P' : '';
    const availableSlots = rows
      .map((row, index) => ({
        row: Array(7).fill('').map((_, i) => row[i] || ''), // Preenche com '' se indefinido
        index,
      }))
      .filter(({ row }) => !row[3] && (row[2] === modalityCode || !row[2]));
    console.log('Slots disponíveis:', availableSlots);
    return availableSlots.map(({ row }) => row);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

const bookSlot = async ({ rowIndex, studentName, book, content, whatsapp }) => {
  const client = await auth.getClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Sheet1!A:G';
  try {
    console.log('Iniciando bookSlot com dados:', { rowIndex, studentName, book, content, whatsapp });
    if (!Number.isInteger(rowIndex) || rowIndex < 0) {
      throw new Error(`rowIndex inválido: ${rowIndex}`);
    }

    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];
    console.log('Linhas da planilha:', rows);

    if (rowIndex >= rows.length) {
      throw new Error(`rowIndex fora do intervalo: ${rowIndex} (máximo: ${rows.length - 1})`);
    }

    const existingBookingIndex = rows.findIndex(
      (row, index) => (row[3] || '') === studentName && index !== rowIndex
    );
    console.log('Índice de agendamento existente:', existingBookingIndex);

    if (existingBookingIndex !== -1) {
      const clearRange = `Sheet1!D${existingBookingIndex + 1}:G${existingBookingIndex + 1}`;
      console.log('Limpando agendamento anterior:', clearRange);
      await sheets.spreadsheets.values.update({
        auth: client,
        spreadsheetId,
        range: clearRange,
        valueInputOption: 'RAW',
        resource: { values: [['', '', '', '']] },
      });
      console.log('Agendamento anterior limpo na linha:', existingBookingIndex + 1);
    }

    const updateRange = `Sheet1!D${rowIndex + 1}:G${rowIndex + 1}`;
    const updateValues = [[studentName, book || '', content || '', whatsapp || '']];
    console.log('Atualizando linha:', updateRange, 'com valores:', updateValues);
    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      resource: { values: updateValues },
    });
    console.log('Linha atualizada com sucesso');
  } catch (error) {
    console.error('Erro detalhado em bookSlot:', error);
    throw error;
  }
};

module.exports = { getAvailableSlots, bookSlot };