# MongoDB Fullstack

Aplicação web para cadastrar produtos e registrar pedidos de uma padaria. O projeto possui uma API REST em Node.js, um front-end estático servido pela própria API, MongoDB Atlas como banco de dados e Prisma como ORM.

> Detalhe! Se quiser utilizar o link do pages, mantenha o servidor ligado.

## O que foi desenvolvido

- Cadastro, listagem, edição, busca e exclusão de produtos.
- Cadastro, listagem, edição, busca e exclusão de pedidos.
- Verificação de estoque ao cadastrar ou alterar um pedido.
- Interface responsiva para as páginas de produtos e pedidos.
- API REST organizada em rotas, controladores e acesso ao banco com Prisma.
- Modelagem das coleções `Produto` e `Pedido` no MongoDB.
- Coleção do Insomnia disponível em [docs/Insomnia_2026-11-18-21-39-42.yaml](docs/Insomnia_2026-11-18-21-39-42.yaml).

## Tecnologias

- Node.js
- Express
- MongoDB Atlas
- Prisma ORM 6.19.3
- HTML, CSS e JavaScript
- CORS e dotenv

## Estrutura do projeto

```text
.
|-- api/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   |-- seed.js
|   |   `-- prisma.config.ts
|   |-- src/
|   |   |-- controllers/
|   |   |-- data/
|   |   `-- routes/
|   |-- .env
|   |-- package.json
|   `-- server.js
|-- docs/
|   |-- DER.png
|   `-- Insomnia_2026-11-18-21-39-42.yaml
|-- web/
|   |-- pedidos.html
|   |-- produtos.html
|   |-- script.js
|   `-- style.css
|-- _assets/
|   |-- screenshot1.png
|   `-- screenshot2.png
`-- README.md
```

## Pré-requisitos

Antes de começar, instale:

- Node.js 18 ou superior.
- Uma conta no MongoDB Atlas ou uma instância local do MongoDB.
- Git, caso queira clonar o repositório.
- Insomnia ou Postman, opcionalmente, para testar a API.

## Comandos principais

Execute dentro de `api`:

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

## Como executar o projeto

### 1. Baixar o projeto

Clone o repositório ou abra a pasta do projeto já existente em seu editor.

```bash
git clone https://github.com/zenvexy/MongoDB.git
cd MongoDB
```

### 2. Instalar as dependências da API

No terminal, entre na pasta `api` e instale as dependências:

```bash
cd api
npm install
```

### 3. Criar o arquivo de ambiente

Crie o arquivo `api/.env`. Ele guarda a porta da API e a URL do banco. Nunca envie esse arquivo, senhas ou uma URL de conexão real para o repositório.

```env
PORT=3000
DATABASE_URL="mongodb+srv://USUARIO:SENHA@SEU_CLUSTER.mongodb.net/NOME_DO_BANCO?retryWrites=true&w=majority"
```

Substitua os valores abaixo:

- `USUARIO`: usuário criado no MongoDB Atlas.
- `SENHA`: senha desse usuário. Caracteres especiais precisam estar codificados na URL.
- `SEU_CLUSTER`: endereço do cluster fornecido pelo Atlas.
- `NOME_DO_BANCO`: nome desejado para o banco, por exemplo `loja_eletronicos`.

### 4. Gerar o cliente Prisma e criar as coleções

Ainda dentro de `api`, execute:

```bash
npx prisma generate
npx prisma db push
```

O primeiro comando gera o cliente do Prisma. O segundo lê `prisma/schema.prisma` e cria ou atualiza as coleções e os índices no MongoDB.

### 5. Inserir dados de exemplo, opcional

O projeto possui uma seed com produtos e pedidos de exemplo. Ela apaga os produtos e pedidos existentes antes de inserir os novos dados.

```bash
npx prisma db seed
```

Use esse comando somente quando for aceitável limpar os dados atuais do banco.

### 6. Iniciar a aplicação

```bash
npm run dev
```

Para iniciar sem o modo de observação:

```bash
npm start
```

Com o servidor em execução, abra [http://localhost:3000](http://localhost:3000). A página inicial redireciona para a tela de produtos. A página de pedidos está em [http://localhost:3000/pedidos.html](http://localhost:3000/pedidos.html).

## Configuração do MongoDB Atlas

### 1. Criar ou selecionar um projeto

Entre no [MongoDB Atlas](https://www.mongodb.com/atlas), crie um projeto e crie um cluster. Para testes, o plano gratuito é suficiente.

### 2. Criar o usuário do banco

No Atlas, abra **Database Access**, escolha **Add New Database User**, defina usuário e senha e conceda acesso de leitura e escrita ao banco desejado.

### 3. Liberar o acesso de rede

Abra **Network Access** e adicione o endereço IP que poderá se conectar ao cluster. Para desenvolvimento, use seu IP atual. Evite liberar todos os endereços em ambientes de produção.

### 4. Copiar a URL de conexão

No cluster, selecione **Connect**, depois **Drivers** e **Node.js**. Copie a URL `mongodb+srv` exibida pelo Atlas, substitua a senha e coloque o resultado no `api/.env` como `DATABASE_URL`.

### 5. Aplicar o schema

Volte ao terminal da pasta `api` e execute:

```bash
npx prisma generate
npx prisma db push
```

Se os comandos terminarem sem erro, o banco estará pronto para uso.

### Configuração com MongoDB local

Caso esteja usando MongoDB instalado no computador, use uma URL local no `api/.env`:

```env
PORT=3000
DATABASE_URL="mongodb://127.0.0.1:27017/loja_eletronicos"
```

Depois execute os mesmos comandos do Prisma:

```bash
npx prisma generate
npx prisma db push
```

## Modelo de dados

O schema Prisma está em `api/prisma/schema.prisma` e define duas coleções.

| Coleção | Campos | Descrição |
| --- | --- | --- |
| `Produto` | `id`, `nome`, `preco`, `estoque` | Itens disponíveis para venda. |
| `Pedido` | `id`, `cliente`, `produtoId`, `quantidade` | Pedido de um cliente e sua relação com um produto. |

O campo `id` é um `ObjectId` do MongoDB. Na API, ele é enviado como uma string hexadecimal de 24 caracteres, por exemplo `6afe4e4001ce22e5437bd3ca`. Cada pedido possui `produtoId`, que referencia o produto associado.

![Diagrama entidade-relacionamento](docs/DER.png)

## Banco de dados no Atlas

Após executar a seed ou cadastrar dados pelo sistema, o MongoDB Atlas exibe as coleções criadas pelo Prisma.

### Coleção de produtos

![Coleção Produto no MongoDB Atlas](_assets/screenshot2.png)

Cada documento contém o nome, preço e estoque de um produto.

### Coleção de pedidos

![Coleção Pedido no MongoDB Atlas](_assets/screenshot1.png)

Cada pedido contém o cliente, a quantidade e o `produtoId` do produto relacionado.

## Front-end

O front-end está na pasta `web` e é disponibilizado pelo Express. Não é necessário iniciar outro servidor para as páginas HTML.

- `produtos.html`: cadastro e gerenciamento de produtos.
- `pedidos.html`: cadastro e gerenciamento de pedidos.
- `script.js`: chamadas para a API, atualização das tabelas, busca e edição.
- `style.css`: estilos compartilhados pelas duas páginas.

Para criar um pedido, primeiro cadastre pelo menos um produto com estoque maior que zero. A API rejeita pedidos cuja quantidade seja maior do que o estoque disponível.

## API REST

A API utiliza a base `http://localhost:3000`.

### Produtos

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/produtos/listar` | Lista todos os produtos. |
| `POST` | `/produtos/cadastrar` | Cadastra um produto. |
| `PUT` | `/produtos/atualizar/:id` | Altera um produto pelo ID. |
| `DELETE` | `/produtos/excluir/:id` | Exclui um produto pelo ID. |

#### Cadastrar produto

```http
POST /produtos/cadastrar
Content-Type: application/json

{
  "nome": "Coxinha",
  "preco": 6,
  "estoque": 20
}
```

#### Alterar produto pelo ID

Substitua `ID_DO_PRODUTO` pelo valor de `_id` retornado pelo MongoDB ou pelo endpoint de listagem.

```http
PUT /produtos/atualizar/ID_DO_PRODUTO
Content-Type: application/json

{
  "nome": "Coxinha de frango",
  "preco": 7,
  "estoque": 25
}
```

#### Excluir produto pelo ID

```http
DELETE /produtos/excluir/ID_DO_PRODUTO
```

### Pedidos

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/pedidos/listar` | Lista pedidos com o produto relacionado. |
| `POST` | `/pedidos/cadastrar` | Cadastra um pedido. |
| `PUT` | `/pedidos/atualizar/:id` | Altera um pedido pelo ID. |
| `DELETE` | `/pedidos/excluir/:id` | Exclui um pedido pelo ID. |

#### Cadastrar pedido

Use o ID de um produto existente no campo `produtoId`.

```http
POST /pedidos/cadastrar
Content-Type: application/json

{
  "cliente": "Ana Souza",
  "produtoId": "ID_DO_PRODUTO",
  "quantidade": 3
}
```

#### Exemplo de pedido retornado pela API

Ao listar pedidos, a API também retorna o produto relacionado. Este é um exemplo real do formato retornado, incluindo os IDs utilizados pelo MongoDB:

```json
{
  "id": "6afe4e4001ce22e5437bd3ca",
  "cliente": "Ana Souza",
  "produtoId": "6afe4e3f01ce22e5437bd3c7",
  "quantidade": 3,
  "produto": {
    "id": "6afe4e3f01ce22e5437bd3c7",
    "nome": "Pastel",
    "preco": 7,
    "estoque": 10
  }
}
```

Nesse exemplo, `6afe4e4001ce22e5437bd3ca` é o ID do pedido. O valor `6afe4e3f01ce22e5437bd3c7` identifica o produto e aparece tanto em `produtoId` quanto em `produto.id`.

#### Alterar pedido pelo ID

```http
PUT /pedidos/atualizar/ID_DO_PEDIDO
Content-Type: application/json

{
  "cliente": "Ana Souza",
  "produtoId": "ID_DO_PRODUTO",
  "quantidade": 4
}
```

#### Excluir pedido pelo ID

```http
DELETE /pedidos/excluir/ID_DO_PEDIDO
```

## Testes com Insomnia

1. Abra o Insomnia.
2. Importe o arquivo `docs/Insomnia_2026-11-18-21-39-42.yaml`.
3. Inicie a API com `npm run dev` dentro de `api`.
4. Escolha uma requisição da coleção **Loja Salgados**.
5. Para rotas de atualização e exclusão, informe um ID válido no final da URL.

## Solução de problemas

| Problema | Possível solução |
| --- | --- |
| Erro ao conectar ao MongoDB | Confira `DATABASE_URL`, usuário, senha, acesso de rede e o cluster no Atlas. |
| `prisma db push` falha | Confirme que está na pasta `api`, que o `.env` existe e que a URL usa `mongodb` como provider. |
| Página não abre | Inicie a API e acesse `http://localhost:3000`, não o arquivo HTML diretamente. |
| Porta 3000 ocupada | Altere `PORT` no `.env` e use a mesma porta em `web/script.js`. |
| Pedido não é salvo | Cadastre um produto com estoque suficiente e confira se `produtoId` é válido. |
