const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const { nomeEquipe, lider_id, nomeLider } = req.body;

    try {
        // Verificar se o líder existe na tabela empregados
        const [lider] = await pool.execute('SELECT id, nome FROM empregados WHERE id = ?', [lider_id]);
        if (lider.length === 0) {
            return res.status(404).json({ mensagem: 'Líder não encontrado' });
        }

        // Validar se o nome do líder corresponde ao ID fornecido
        if (lider[0].nome.toLowerCase() !== nomeLider.toLowerCase()) {
            return res.status(400).json({ mensagem: 'Nome do líder não corresponde ao ID fornecido' });
        }

        // Inserir a equipe na tabela equipes
        const [result] = await pool.execute(
            'INSERT INTO equipes (nomeEquipe, lider_id, nomeLider) VALUES (?, ?, ?)',
            [nomeEquipe, lider_id, nomeLider]
        );

        // Retornar os dados inseridos
        res.status(201).json({
            id: result.insertId,
            nomeEquipe,
            lider_id,
            nomeLider
        });
    } catch (error) {
        console.error('Erro ao criar equipe:', error);
        res.status(500).json({ mensagem: 'Erro ao criar equipe' });
    }
});


router.post('/:equipeId/membros', async (req, res) => {
    const { equipeId } = req.params;
    const { membroId } = req.body;

    try {
        const [empregado] = await pool.execute('SELECT nome, cargo FROM empregados WHERE id = ?', [membroId]);
        if (empregado.length === 0) {
            return res.status(404).send('Funcionário não encontrado');
        }

        await pool.execute('INSERT INTO equipe_membros (equipe_id, empregado_id) VALUES (?, ?)', [equipeId, membroId]);

        res.status(201).json({
            mensagem: 'Membro adicionado à equipe com sucesso',
            membro: { equipe_id: equipeId, empregado_id: membroId, nome: empregado[0].nome, areaAtuacao: empregado[0].cargo }
        });
    } catch (error) {
        console.error('Erro ao adicionar membro à equipe:', error);
        res.status(500).send('Erro ao adicionar membro à equipe');
    }
});

module.exports = router;
