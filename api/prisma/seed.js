
const prisma = require("../src/data/prisma");

async function main() {
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();

  const produtos = await Promise.all([
    prisma.produto.create({
      data: { nome: "Coxinha", preco: 6.00, estoque: 20 }
    }),
    prisma.produto.create({
      data: { nome: "Pastel", preco: 7.00, estoque: 10 }
    }),
    prisma.produto.create({
      data: { nome: "Risole", preco: 5.00, estoque: 15 }
    }),
    prisma.produto.create({
      data: { nome: "Esfiha", preco: 6.50, estoque: 20 }
    }),
    prisma.produto.create({
      data: { nome: "Empada", preco: 5.50, estoque: 12 }
    })
  ]);

  console.log("Produtos cadastrados!");

  await Promise.all([
    prisma.pedido.create({
      data: {
        cliente: "Ana Souza",
        produtoId: produtos[1].id,
        quantidade: 3
      }
    }),
    prisma.pedido.create({
      data: {
        cliente: "Bruno Lima",
        produtoId: produtos[2].id,
        quantidade: 2
      }
    }),
    prisma.pedido.create({
      data: {
        cliente: "Carla Mendes",
        produtoId: produtos[3].id,
        quantidade: 6
      }
    })
  ]);

  console.log("Pedidos cadastrados!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
