require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../web")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/produtos.html"));
});

const produtosRoutes = require('./src/routes/produtos.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');

app.use('/produtos', produtosRoutes);
app.use('/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;