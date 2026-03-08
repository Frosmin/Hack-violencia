const express = require('express');
const cors = require('cors');

const app = express();

const geminiRoutes = require('./routes/llmRoute');
const emailRoutes = require('./routes/emailRoute');


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor Express configurado correctamente.');
});

app.use('/api/gemini', geminiRoutes);
app.use('/api/email', emailRoutes);


module.exports = app;