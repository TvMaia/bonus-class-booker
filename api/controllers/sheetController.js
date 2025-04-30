const googleSheetsService = require('../services/googleSheetsService');

const getAvailableSlots = async (req, res) => {
  try {
    const modality = req.query.modality;
    const slots = await googleSheetsService.getAvailableSlots(modality);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bookSlot = async (req, res) => {
  try {
    const bookingData = req.body;
    const result = await googleSheetsService.bookSlot(bookingData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  bookSlot,
};