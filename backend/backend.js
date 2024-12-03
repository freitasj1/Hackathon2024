const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'projetoSimter',
    database: 'hackathon',
};

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota para redirecionar "/" para "index.html"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Função para executar query SQL
function executeQuery(query, params, callback) {
    const connection = mysql.createConnection(dbConfig);

    connection.query(query, params, (error, results) => {
        connection.end();
        if (error) {
            console.error('Erro ao executar query:', error.message);
            callback(false, null);
        } else {
            callback(true, results);
        }
    });
}

// Rota para receber valores da IA
app.get('/ia/:variavel', (req, res) => {
    const variavel = parseInt(req.params.variavel, 10);
    console.log('Valor recebido IA:', variavel);

    if (variavel !== 0 && variavel !== 1) {
        return res.status(400).json({ error: 'Valor inválido. Apenas 0 ou 1 são permitidos.' });
    }

    const insertQuery = 'INSERT INTO responses (response) VALUES (?)';
    executeQuery(insertQuery, [variavel], (success) => {
        if (success) {
            res.status(200).json({ message: 'Valor da IA registrado com sucesso.' });
        } else {
            res.status(400).json({ error: 'Erro ao registrar valor da IA.' });
        }
    });
});

// Rota para receber valores do ECG
app.get('/ecg/:variavel', (req, res) => {
    const variavel = parseInt(req.params.variavel, 10);
    console.log('Valor recebido ECG:', variavel);

    if (variavel !== 0 && variavel !== 1) {
        return res.status(400).json({ error: 'Valor inválido. Apenas 0 ou 1 são permitidos.' });
    }

    const insertQuery = 'INSERT INTO ecg_data (response) VALUES (?)';
    executeQuery(insertQuery, [variavel], (success) => {
        if (success) {
            res.status(200).json({ message: 'Valor do ECG registrado com sucesso.' });
        } else {
            res.status(400).json({ error: 'Erro ao registrar valor do ECG.' });
        }
    });
});


app.get('/verificar', (req, res) => {
    // Consulta os últimos 2 valores de cada tabela
    console.log('Consultando valores ECG e IA')
    const queryLastResponses = `
        (SELECT response FROM responses ORDER BY id DESC LIMIT 1) AS last_response,
        (SELECT response FROM ecg_data ORDER BY id DESC LIMIT 1) AS last_ecg_response
    `;

    const query = `SELECT ${queryLastResponses}`;

    executeQuery(query, [], (success, results) => {
        if (!success || results.length === 0) {
            return res.status(500).json({ error: 'Erro ao buscar os últimos valores.' });
        }

        const lastResponse = results[0].last_response;
        const lastEcgResponse = results[0].last_ecg_response;
        console.log("Valor IA: ", lastResponse,);
        console.log("Valor ECG: ", lastEcgResponse,);
        if (lastResponse === 1 && lastEcgResponse === 1) {
            console.log("Inveja detectada");
            return res.status(200).send('1'); // Ambos são 1
        } else {
            console.log("Inveja não detectada");
            return res.status(200).send('0'); // Algum deles não é 1
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
