import { google } from 'googleapis';

console.log('Client Email from env:', process.env.GOOGLE_SHEET_CLIENT_EMAIL);
console.log('Spreadsheet ID from env:', process.env.GOOGLE_SHEET_ID);
console.log('Private Key from env (first 50 chars):', process.env.GOOGLE_SHEET_PRIVATE_KEY?.substring(0, 50));

const privateKey = process.env.GOOGLE_SHEET_PRIVATE_KEY
  ? process.env.GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

console.log('Processed Private Key (first 50 chars):', privateKey?.substring(0, 50));

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export default async function handler(req, res) {
  try {
    const modality = req.query.modality; // 'O' ou 'P'
    const client = await auth.getClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:G';
    const response = await google.sheets('v4').spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    console.log('Raw rows from Google Sheets:', rows);

    const availableSlots = rows
      .map((row, index) => ({
        row,
        index,
        horario: row[1]?.trim(), // Coluna B: HORARIO
        modalidade: row[2]?.trim() || '', // Coluna C: MODALIDADE (vazio se undefined)
        aluno: row[3]?.trim() || '', // Coluna D: ALUNO (vazio se undefined)
      }))
      .filter(({ aluno, modalidade, index, horario }) => {
        const isAvailable = !aluno; // Disponível se aluno estiver vazio
        const matchesModality = modalidade === '' || modalidade === modality; // Modalidade vazia ou correspondente
        const isValid = isAvailable && index > 0 && horario; // Ignora cabeçalho e linhas sem horário
        console.log(
          `Row ${index}: Horario=${horario}, Modalidade=${modalidade}, Aluno=${aluno}, IsAvailable=${isAvailable}, MatchesModality=${matchesModality}, IsValid=${isValid}`
        );
        return isValid && matchesModality;
      })
      .map(({ horario }) => horario);

    console.log('Filtered available slots:', availableSlots);

    const uniques = Array.from(new Set(availableSlots));
    res.status(200).json(uniques.map((horario) => ({ horario })));
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ error: 'Erro ao carregar horários' });
  }
}