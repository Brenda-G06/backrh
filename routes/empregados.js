const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empregados');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar empregados:', error);
        res.status(500).send('Erro ao buscar empregados');
    }
});

router.post('/', async (req, res) => {
    const { nome, cargo, data_admissao } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO empregados (nome, cargo, data_admissao) VALUES (?, ?, ?)',
            [nome, cargo, data_admissao]
        );
        res.status(201).json({ id: result.insertId, nome, cargo, data_admissao });
    } catch (error) {
        console.error('Erro ao inserir empregado:', error);
        res.status(500).send('Erro ao inserir empregado');
    }
});

module.exports = router;
