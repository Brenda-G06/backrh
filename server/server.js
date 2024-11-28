require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const empregadosRoutes = require('../routes/empregados.js');
const avaliacoesRoutes = require('../routes/avaliacoes.js');
const equipesRoutes = require('../routes/equipes.js');

app.use('/api/empregados', empregadosRoutes);
app.use('/api/avaliacoes', avaliacoesRoutes);
app.use('/api/equipes', equipesRoutes);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
