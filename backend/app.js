require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bonusClassRoutes = require('./routes/bonusClassRoutes');


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/bonus-class', bonusClassRoutes);

module.exports = app;