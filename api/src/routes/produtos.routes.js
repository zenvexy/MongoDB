const express = require("express");

const router = express.Router();

const { 
    listar,
    cadastrar,  
    atualizar, 
    excluir } = require("../controllers/produtos.controllers");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;