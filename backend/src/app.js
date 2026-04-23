const express = require('express');
const cors = require('cors');

const app = express();

const geminiRoutes = require('./routes/llmRoute');
const emailRoutes = require('./routes/emailRoute');
const authRoutes = require('./routes/authRoute');


const evidenceRoutes = require('./routes/evidenceRoute');



app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor Express configurado correctamente.');
});

app.use('/api/gemini', geminiRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/evidence', evidenceRoutes);

module.exports = app;