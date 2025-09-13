const express = require("express");
const router = express.Router();

const {
  createForm,
  getForms,
  getFormData,
} = require("../controllers/formController");


//app.use("/forms", formRoutes);


// Criar formulário
router.post("/", createForm);

// Listar formulários do usuário
router.get("/", getForms);

// Obter dados de respostas de um formulário
router.get("/:id", getFormData);

module.exports = router;
