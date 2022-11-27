const { Pool } = require('pg');

const pool = new Pool ({
  host: 'localhost',
  port: 5432,
  user: 'postgres', // => INSIRA SEU USUÁRIO DO POSTGRES
  password: '123456', // =>INSIRA A SENHA DO SEU BANCO DE DADOS AQUI
  database: 'socketio'
});

module.exports = pool;