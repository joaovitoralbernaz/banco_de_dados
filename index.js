const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            email TEXT,
            telefone TEXT,
            logradouro VARCHAR(50) NOT NULL,
            numero VARCHAR(5) NOT NULL,
            complemento VARCHAR(20),
            bairro VARCHAR(30) NOT NULL,
            cidade VARCHAR(20) NOT NULL,
            estado VARCHAR(2) NOT NULL,
            cep VARCHAR(9) NOT NULL
        )
    `);


    console.log("Tabelas criadas com sucesso.");
});



///////////////////////////// Rotas para Clientes /////////////////////////////


// Cadastrar cliente
app.post("/clientes", (req, res) => {
    const { nome, cpf, email, telefone, logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body;

    // Validações básicas
    if (!nome || !cpf) {
        return res.status(400).json({ message: "Nome e CPF são obrigatórios." });
    }




    const query = `INSERT INTO clientes (nome, cpf, email, telefone, logradouro, numero, complemento, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
        query,
        [nome, cpf, email, telefone, logradouro, numero, complemento, bairro, cidade, estado, cep], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar cliente....');
        }
        res.status(201).send({ id: this.lastID, message: 'Cliente cadastrado com sucesso.' });
    });
});

// Listar clientes
// Endpoint para listar todos os clientes ou buscar por CPF
app.get('/clientes', (req, res) => {
    const cpf = req.query.cpf || '';  // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM clientes WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar clientes.' });
            }
            res.json(rows);  // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar clientes.' });
            }
            res.json(rows);  // Retorna todos os clientes
        });
    }
});


// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});