const Form = require("../models/Forms");
const axios = require("axios");

// Função para converter CSV em JSON
const csvToJson = (csv) => {
  const lines = csv.split("\n").filter(line => line.trim() !== "");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(",").map(c => c.trim().replace(/"/g, ""));
    headers.forEach((header, index) => {
      obj[header] = currentLine[index] || "";
    });
    result.push(obj);
  }

  return result;
};

// ==========================
// Criar formulário sem autenticação
// ==========================
exports.createForm = async (req, res) => {
  try {
    const { name, questionsLink, answersLink } = req.body;

    if (!name || !questionsLink || !answersLink) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const form = await Form.create({
      name,
      questionsLink,
      answersLink,
      createdBy: "public", // valor fixo, sem usar req.userId
    });

    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erro ao criar formulário" });
  }
};

// ==========================
// Listar todos os formulários sem autenticação
// ==========================
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({}); // pega todos os formulários
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar formulários" });
  }
};

// ==========================
// Buscar dados do formulário (CSV -> JSON)
// ==========================
exports.getFormData = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Formulário não encontrado" });

    const response = await axios.get(form.answersLink);
    const csvData = response.data;

    const data = csvToJson(csvData);

    const grouped = {};
    if (data.length > 0) {
      const headers = Object.keys(data[0]).slice(1); // ignora timestamp
      headers.forEach((question) => {
        grouped[question] = {};
        data.forEach((row) => {
          const answer = row[question] || "Sem resposta";
          grouped[question][answer] = (grouped[question][answer] || 0) + 1;
        });
      });
    }

    res.json({
      totalRespostas: data.length,
      resumo: grouped,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados do Google Sheets" });
  }
};
