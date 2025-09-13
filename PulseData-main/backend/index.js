require("dotenv").config({ path: __dirname + '/.env' });
console.log("MONGO_URI =", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB usando variáveis do .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // força SSL
  tlsAllowInvalidCertificates: false, // mantém seguro
})
.then(() => console.log("✅ Conectado ao MongoDB com sucesso"))
.catch(err => console.error("❌ Erro de conexão MongoDB:", err));

app.use("/auth", authRoutes);
app.use("/forms", formRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
