const express = require('express');
const router = express.Router();
const { getAvailableSlots, bookSlot } = require('../services/googleSheetsService');

router.get('/available', async (req, res) => {
  try {
    const modality = req.query.modality;
    console.log('Buscando horários para modalidade:', modality);
    const slots = await getAvailableSlots(modality);
    res.json(slots);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { horario, modality, studentName, book, content, whatsapp } = req.body;
    console.log('Dados recebidos para agendamento:', req.body);
    if (!horario || !modality || !studentName) {
      throw new Error('horario, modality ou studentName ausente');
    }
    await bookSlot({ horario, modality, studentName, book, content, whatsapp });
    res.json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Erro detalhado no agendamento:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;