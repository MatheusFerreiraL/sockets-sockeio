# Trabalho de Sistemas Distribuídos 

O trabalho foi desenvolvido utilizado o gerenciador de Banco de Dados Postgres e como GUI o editor Beekeeper. A linguagem escolhida foi Javascript em back-end (NodeJS).

## Setup para execução do projeto

### NodeJS
A instalação do NodeJS deve ser feita <a href="https://nodejs.org/en/download/">por aqui</a>, com os instaladores específicos para cada Sistema Operacional (a instalação para Linux Ubuntu é encontrada <a href="https://github.com/nodesource/distributions/blob/master/README.md#deb">aqui</a>).

Para verificar se a instalação ocorreu corretamente deverá usar o comando ```node --version``` no terminal. Caso a instalação tenha ocorrido corretamente, será retornado a versão do Node no sistema (e.g.: ```v.18.12.1``` ).

### Postgres


No caso do windows, a instalação deverá ser feita <a href="https://www.enterprisedb.com/downloads/postgres-postgresql-downloads">através deste link</a>. O setup do instalador deve seguir as diretrizes que seguem:

- Componentes selecionados: PostgreSQL Server e Command Line Tools;
- Diretório: padrão do disco C;
- User: nome padrão recomendado `postgres`
- A senha: (isso implicará na alteração do arquivo `connection` para se ajustar a senha settada);
- Port: manter a porta padrão `5432`;
- Locale: indiferente ;

Isso feito, está concluído a instalação do Postgres para windows.

Para o Linux, as instrução de instalação para cada Distro estão <a href="https://www.postgresql.org/download/">neste link.</a>

Uma vez que a instalação tenha sido concluída, no terminal, digite os comandos: 
``` 
sudo -u postgres psql postgres
```
Seguido dos comandos: 
```
\password postgres
```
Momento em que será solicitado a senha e confirmação para conexão do banco de dados (isso implicará na alteração do arquivo `connection` para se ajustar a senha settada)

### Gerenciador de banco de dados (Beekeeper)

O gerenciador de banco de dados usado é o beekeeper, com link para download <a href="https://github.com/beekeeper-studio/beekeeper-studio/releases/tag/v3.6.2">aqui</a>. O instalador depende do sistema operacional: caso seja windows, o arquivo de download termina com `.exe`, as diversas distros do linux também estão disponíveis para download.

Na tela inicial do Beekeeper a seguinte configuração deve ser seguida: 

- Em 'New Connection', escolher a opção `Postgres`;
- A porta, settada no momento da instação, caso tenha sido alterada deve também ser alterada aqui;
- O user, deve ser o mesmo settado no momento da instalação. O default é `postgres`;
- A senha deve ser a mesma escolhida no momento da instalação; 

Feitos isso, basta clicar no botão `Connect`.


## Estrutura de arquivos do projeto

O projeto conta com os seguintes arquivos:

- `.gitignore`;
- `package.json`: contém os pacotes e dependências necessários para executar o projeto;
- `dump.sql`: contém os códigos SQL para criação do banco de dados e da tabela principal que será usado no decorrer do projeto; 
- `connection.js`: arquivo com as configurações de conexão da aplicação com o banco de dados: 

```json
{
  host: 'localhost',
  port: 5432, //PORTA SETTADA NA INSTALAÇÃO 
  user: 'postgres', //USER SETTADO NA INSTALAÇÃO (deve estar entre aspas)
  password: '', //SENHA SETTADA PARA O BANCO (deve estar entre aspas)
  database: 'socketio'
};
```
- `server.js`: arquivo com a conexão do socket e demais módulos para execução do projeto;
- `/public`: pasta contém os arquivos `index` e `styles`, que fazem os ajuste do front-end da aplicação.

## Executando o projeto

Os os módulos devem ser instalados via terminal usando o `npm` (padrão do Node) ou `yarn`. Acesse a pasta do projeto no terminal e execute o comando:
``` 
npm install //usando NPM
yarn install //usando yarn
```
Com todos os pacotes instalados, esecute no terminal o comando `node server.js`.

A mensagem `Server running on port 8000` deve aparecer no terminal.

Acesso o navegador passando a URL: http://localhost:8000

## Comandos padrão do projeto