require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('../db.js');

app.use(cors());
app.use(express.json());

const empregadosRoutes = require('../routes/empregados.js');
const avaliacoesRoutes = require('../routes/avaliacoes.js');
const equipesRoutes = require('../routes/equipes.js');
const curriculosRoutes = require('../routes/curriculos.js');
app.use('/api/curriculos', curriculosRoutes);
app.use('/api/empregados', empregadosRoutes);
app.use('/api/avaliacoes', avaliacoesRoutes);
app.use('/api/equipes', equipesRoutes);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


(async () => {
    try {
        const [rows] = await pool.execute('SHOW TABLES');
        console.log('Conexão bem-sucedida:', rows);
    } catch (error) {
        console.error('Erro ao conectar no banco de dados:', error);
    }
})();

