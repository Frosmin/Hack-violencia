const express = require("express");
const cors = require("cors");

const app = express();

const llmRoutes = require("./routes/llmRoute");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor Express configurado correctamente.");
});

app.use("/api/llm", llmRoutes);

module.exports = app;
