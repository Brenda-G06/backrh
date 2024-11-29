const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const { membro_id, nota, comentario } = req.body;

    // Validação: Verificar se os dados obrigatórios foram fornecidos
    if (!membro_id || nota === undefined) {
        return res.status(400).send("Os campos 'membro_id' e 'nota' são obrigatórios.");
    }

    // Validação: Garantir que a nota esteja no intervalo permitido
    if (nota < 0 || nota > 5) {
        return res.status(400).send("A 'nota' deve estar entre 0 e 5.");
    }

    try {
        // Inserção no banco de dados
        const [result] = await pool.execute(
            'INSERT INTO avaliacoes (membro_id, nota, comentario, data_avaliacao) VALUES (?, ?, ?, CURDATE())',
            [
                membro_id,
                parseFloat(nota.toFixed(2)), // Garantir compatibilidade com decimal(3,2)
                comentario || null           // Permitir campo nulo para comentário
            ]
        );

        // Resposta de sucesso
        res.status(201).json({
            id: result.insertId,
            membro_id,
            nota: parseFloat(nota.toFixed(2)),
            comentario: comentario || null,
            data_avaliacao: new Date().toISOString().split('T')[0] // Data formatada como YYYY-MM-DD
        });
    } catch (error) {
        console.error('Erro ao inserir avaliação:', error);
        res.status(500).send('Erro ao registrar a avaliação.');
    }
});

module.exports = router;



/*'comentario', 'text', 'YES', '', NULL, ''
'data_avaliacao', 'date', 'YES', '', NULL, ''
'id', 'int', 'NO', 'PRI', NULL, 'auto_increment'
'membro_id', 'int', 'YES', 'MUL', NULL, ''
'nota', 'decimal(3,2)', 'YES', '', NULL, ''
*/