CREATE DATABASE socketio;

CREATE TABLE principal (
	cod_op INTEGER NOT NULL,
  nome_vendedor TEXT NOT NULL,
  id_loja INTEGER NOT NULL,
  data_venda DATE DEFAULT now(),
  valor_venda NUMERIC CHECK (valor_venda > 0) NOT NULL
);

/*
  codigo de operação
  nome vendedor
  id Loja
  nome Loja
  data venda
  valor venda
*/