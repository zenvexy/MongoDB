const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const lista = await prisma.produto.findMany();

    return res.status(200).json(lista);
};

const cadastrar = async (req, res) => {
    const item = await prisma.produto.create({
        data: req.body
    });

    return res.status(201).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const item = await prisma.produto.update({
        where: { id },
        data: dados
    });

    return res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.produto.delete({
        where: { id }
    });

    return res.status(200).json(item);
};

module.exports = {
    cadastrar,
    listar,
    atualizar,
    excluir
}