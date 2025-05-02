import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets('v4');

export default async function handler(req, res) {
  try {
    const {
      modality,
      horario,
      studentName,
      book,
      content,
      whatsapp,
    } = req.body;

    const client = await auth.getClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:G';
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];

    const rowIndex = rows.findIndex(
      (r) => r[1] === horario && (!r[2] || r[2] === modality) && !r[3]
    );
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Slot não encontrado' });
    }
    const sheetRow = rowIndex + 1;
    const target = `Sheet1!A${sheetRow}:G${sheetRow}`;

    const teacher = rows[rowIndex][0] || '';
    const newRow = [
      teacher,
      horario,
      modality,
      studentName,
      book,
      content,
      whatsapp,
    ];

    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: target,
      valueInputOption: 'RAW',
      resource: { values: [newRow] },
    });

    res.status(200).json({ message: 'Agendamento salvo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar agendamento' });
  }
}