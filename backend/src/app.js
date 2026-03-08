const express = require('express');

const app = express();

const geminiRoutes = require('./routes/llmRoute');


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Servidor Express configurado correctamente.');
});

app.use('/api/gemini', geminiRoutes);


module.exports = app;