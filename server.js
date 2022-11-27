const express = require("express");
const pool = require("./connection");
const path = require("path");
const PORTA = 8000;

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.render("index.html");
});

const author = "SERVER";
io.on("connection", socket => {
  //o que será feito toda vez que um novo usuário se conectar
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("sendMessage", async data => {
    switch (data.author) {
      case "GERENTE":
        const flagManager = await handleManager(data);
        if (!flagManager.status) {
          socket.emit("receivedMessage", { author, message: "ERROR" });
          break;
        }
        socket.emit("receivedMessage", { author, message: flagManager.resp });
        break;
      case "VENDEDOR":
        const flag = await handleSeller(data);
        if (!flag) {
          socket.emit("receivedMessage", { author, message: "ERROR" });
          break;
        }
        socket.emit("receivedMessage", { author, message: "OK" });
        break;
      case !"Vendedor" && !"Gerente":
        socket.emit("receivedMessage", "ERROR");
        break;
      default:
        socket.emit("receivedMessage", { author, message:"ERROR" });
    }
  });
});

async function handleSeller(data) {
  const { message } = data;
  const untreatedData = message.split(",");

  if (untreatedData.length !== 5) {
    return false;
  }
  const [cod_op, nome_vendedor, id_loja, data_venda, valor_venda] =
    untreatedData;

  try {
    const query = `INSERT INTO principal (cod_op, nome_vendedor, id_loja, data_venda, valor_venda) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [cod_op, nome_vendedor, id_loja, data_venda, valor_venda];

    const { rowCount } = await pool.query(query, values);

    if (rowCount <= 0) return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
  return true;
}

async function handleManager(data) {
  const { message } = data;
  const untreatedData = message.split(",");

  const [op, value, date] = untreatedData;

  switch (op) {
    case "1":
      const response = await handleDatabase(value, Number(op), "nome_vendedor");
      return response;
    case "2":
      const response2 = await handleDatabase(value, Number(op), "id_loja");
      return response2;
    case "3":
      const query = `SELECT COUNT(*) FROM principal WHERE CAST(data_venda AS TIMESTAMP) >= $1 
        AND CAST(data_venda AS TIMESTAMP) <= $2;`;
      const { rows, rowCount } = await pool.query(query, [value, date]);

      if (rowCount <= 0) return { status: false, resp: null };
      return {
        status: true,
        resp: `No período de ${value} a ${date} foram vendido(s) ${rows[0].count} produtos na rede.`,
      };
    case "4":
      const response3 = await handleTheBest("nome_vendedor");
      response3.resp = `O(A) melhor vendedor(a) é ${response3.resp}`;
      return response3;
    case "5":
      const response4 = await handleTheBest("id_loja");
      response4.resp = `A melhor loja é a de Id ${response4.resp}`;
      return response4;
    default:
      return { status: false, resp: "Erro Default" };
  }
}

async function handleTheBest(register) {
  const query = `SELECT ${register} AS register, SUM(valor_venda) FROM principal GROUP BY ${register};`;

  try {
    const { rows, rowCount } = await pool.query(query);

    if (rowCount <= 0) return { status: false, resp: null };
    const theBest = rows.sort((a, b) => {
      return b.sum - a.sum;
    });
    return { status: true, resp: theBest[0].register };
  } catch (error) {
    console.log(error.message);
    return { status: false, resp: null };
  }
}

async function handleDatabase(data, op, register) {
  const query = `SELECT * FROM principal WHERE ${register} = $1`;
  const response = {
    status: false,
    resp: null,
  };

  try {
    const { rows, rowCount } = await pool.query(query, [data]);

    if (rowCount <= 0) return response;

    if (op === 1) {
      response.resp = `${rows[0].nome_vendedor} vendeu ${rowCount} produto(s)`;
      response.status = true;
    } else if (op === 2) {
      response.resp = `A loja de Id ${rows[0].id_loja} vendeu ${rowCount} produtos`;
      response.status = true;
    }

    return response;
  } catch (error) {
    console.log(error.message);
    return response;
  }
}

server.listen(PORTA, console.log(`Server running on port ${PORTA}`));
