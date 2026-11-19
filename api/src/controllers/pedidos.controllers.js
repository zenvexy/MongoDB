const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const lista = await prisma.pedido.findMany({
        include: { produto: true }
    });
    return res.status(200).json(lista);
};

const cadastrar = async (req, res) => {
    const produto = await prisma.produto.findUniqueOrThrow({
        where: { id: req.body.produtoId }
    });

    if (Number(req.body.quantidade) > produto.estoque) {
        return res.status(400).json({ error: "Quantidade solicitada maior que o estoque disponível." });
    }

    const item = await prisma.pedido.create({
        data: req.body
    });

    return res.status(201).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const produto = await prisma.produto.findUniqueOrThrow({
        where: { id: dados.produtoId }
    });

    if (Number(dados.quantidade) > produto.estoque) {
        return res.status(400).json({ error: "Quantidade solicitada maior que o estoque disponível." });
    }

    const item = await prisma.pedido.update({
        where: { id },
        data: dados
    });

    return res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.pedido.delete({
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