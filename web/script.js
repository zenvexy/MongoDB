const apiUrl = "http://localhost:3000";

let produtos = [];
let pedidos = [];
let produtoEditando = null;
let pedidoEditando = null;

function pegar(id) {
  return document.getElementById(id);
}

async function api(url, metodo = "GET", corpo = null) {
  const opcoes = { method: metodo };

  if (corpo) {
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(corpo);
  }

  const resposta = await fetch(apiUrl + url, opcoes);
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.error || "Não foi possível concluir a operação.");
  }

  return dados;
}

function texto(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function mensagem(valor, erro = false) {
  const campo = pegar("mensagem");

  campo.textContent = valor;
  campo.className = erro ? "erro" : "";
}

function situacao(estoque) {
  if (estoque === 0) return "Esgotado";
  if (estoque <= 5) return "Estoque baixo";
  return "Disponível";
}

async function carregarProdutos() {
  produtos = await api("/produtos/listar");

  mostrarProdutos();
  preencherSelectProdutos();
}

function mostrarProdutos() {
  const lista = pegar("listaProdutos");

  if (!lista) return;

  const busca = pegar("buscaProdutos").value.toLowerCase();
  const itens = produtos.filter(p => p.nome.toLowerCase().includes(busca));

  lista.innerHTML = itens.map(p => `
    <tr>
      <td>${texto(p.nome)}</td>
      <td>${moeda(p.preco)}</td>
      <td>${p.estoque}</td>
      <td>${situacao(Number(p.estoque))}</td>
      <td>
        <button data-editar="${p.id}">Editar</button>
        <button data-excluir="${p.id}">Excluir</button>
      </td>
    </tr>
  `).join("");

  pegar("produtosVazios").hidden = itens.length > 0;

  let unidades = 0;
  produtos.forEach(p => unidades += Number(p.estoque));

  pegar("resumoProdutos").textContent =
    `${produtos.length} produtos e ${unidades} unidades em estoque.`;
}

function preencherSelectProdutos() {
  const select = pegar("produtoPedido");

  if (!select) return;

  const escolhido = select.value;
  let opcoes = '<option value="">Escolha um produto</option>';

  produtos.forEach(p => {
    if (p.estoque > 0) {
      opcoes += `<option value="${p.id}">${texto(p.nome)} (${p.estoque} em estoque)</option>`;
    }
  });

  select.innerHTML = opcoes;
  select.value = escolhido;
}

function limparProduto() {
  produtoEditando = null;

  pegar("formProduto").reset();
  pegar("tituloProduto").textContent = "Novo produto";
  pegar("cancelarProduto").hidden = true;
}

function editarProduto(id) {
  const produto = produtos.find(p => String(p.id) === id);

  produtoEditando = id;

  pegar("nomeProduto").value = produto.nome;
  pegar("precoProduto").value = produto.preco;
  pegar("estoqueProduto").value = produto.estoque;
  pegar("tituloProduto").textContent = "Editar produto";
  pegar("cancelarProduto").hidden = false;
}

async function salvarProduto(evento) {
  evento.preventDefault();

  const dados = {
    nome: pegar("nomeProduto").value.trim(),
    preco: Number(pegar("precoProduto").value),
    estoque: Number(pegar("estoqueProduto").value)
  };

  try {
    if (produtoEditando) {
      await api(`/produtos/atualizar/${produtoEditando}`, "PUT", dados);
    } else {
      await api("/produtos/cadastrar", "POST", dados);
    }

    mensagem("Produto salvo.");
    limparProduto();
    await carregarProdutos();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

async function excluirProduto(id) {
  if (!confirm("Excluir este produto?")) return;

  try {
    await api(`/produtos/excluir/${id}`, "DELETE");

    mensagem("Produto excluído.");
    await carregarProdutos();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

function cliqueProdutos(evento) {
  const editar = evento.target.dataset.editar;
  const excluir = evento.target.dataset.excluir;

  if (editar) editarProduto(editar);
  if (excluir) excluirProduto(excluir);
}

function iniciarProdutos() {
  pegar("formProduto").addEventListener("submit", salvarProduto);
  pegar("cancelarProduto").addEventListener("click", limparProduto);
  pegar("buscaProdutos").addEventListener("input", mostrarProdutos);
  pegar("listaProdutos").addEventListener("click", cliqueProdutos);

  carregarProdutos().catch(erro => mensagem(erro.message, true));
}

async function carregarPedidos() {
  pedidos = await api("/pedidos/listar");

  mostrarPedidos();
}

function mostrarPedidos() {
  const lista = pegar("listaPedidos");

  if (!lista) return;

  const busca = pegar("buscaPedidos").value.toLowerCase();

  const itens = pedidos.filter(p => {
    const nomeProduto = p.produto ? p.produto.nome : "";
    return `${p.cliente} ${nomeProduto}`.toLowerCase().includes(busca);
  });

  lista.innerHTML = itens.map(p => {
    const nomeProduto = p.produto ? p.produto.nome : "Produto removido";
    const preco = p.produto ? p.produto.preco : 0;

    return `
      <tr>
        <td>${texto(p.cliente)}</td>
        <td>${texto(nomeProduto)}</td>
        <td>${p.quantidade}</td>
        <td>${moeda(preco * p.quantidade)}</td>
        <td>
          <button data-editar="${p.id}">Editar</button>
          <button data-excluir="${p.id}">Excluir</button>
        </td>
      </tr>
    `;
  }).join("");

  pegar("pedidosVazios").hidden = itens.length > 0;

  let unidades = 0;
  pedidos.forEach(p => unidades += Number(p.quantidade));

  pegar("resumoPedidos").textContent =
    `${pedidos.length} pedidos e ${unidades} unidades pedidas.`;
}

function limparPedido() {
  pedidoEditando = null;

  pegar("formPedido").reset();
  pegar("tituloPedido").textContent = "Novo pedido";
  pegar("cancelarPedido").hidden = true;
}

function editarPedido(id) {
  const pedido = pedidos.find(p => String(p.id) === id);

  pedidoEditando = id;

  pegar("clientePedido").value = pedido.cliente;
  pegar("produtoPedido").value = pedido.produtoId;
  pegar("quantidadePedido").value = pedido.quantidade;
  pegar("tituloPedido").textContent = "Editar pedido";
  pegar("cancelarPedido").hidden = false;
}

async function salvarPedido(evento) {
  evento.preventDefault();

  const dados = {
    cliente: pegar("clientePedido").value.trim(),
    produtoId: pegar("produtoPedido").value,
    quantidade: Number(pegar("quantidadePedido").value)
  };

  try {
    if (pedidoEditando) {
      await api(`/pedidos/atualizar/${pedidoEditando}`, "PUT", dados);
    } else {
      await api("/pedidos/cadastrar", "POST", dados);
    }

    mensagem("Pedido salvo.");
    limparPedido();

    await carregarProdutos();
    await carregarPedidos();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

async function excluirPedido(id) {
  if (!confirm("Excluir este pedido?")) return;

  try {
    await api(`/pedidos/excluir/${id}`, "DELETE");

    mensagem("Pedido excluído.");
    await carregarProdutos();
    await carregarPedidos();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

function cliquePedidos(evento) {
  const editar = evento.target.dataset.editar;
  const excluir = evento.target.dataset.excluir;

  if (editar) editarPedido(editar);
  if (excluir) excluirPedido(excluir);
}

async function iniciarPedidos() {
  pegar("formPedido").addEventListener("submit", salvarPedido);
  pegar("cancelarPedido").addEventListener("click", limparPedido);
  pegar("buscaPedidos").addEventListener("input", mostrarPedidos);
  pegar("listaPedidos").addEventListener("click", cliquePedidos);

  try {
    await carregarProdutos();
    await carregarPedidos();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

const pagina = document.body.dataset.page;

if (pagina === "produtos") iniciarProdutos();
if (pagina === "pedidos") iniciarPedidos();