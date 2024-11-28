const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const { membro_id, assiduidade, comprometimento, cuidado, colaboracao } = req.body;

    const criterios = [assiduidade, comprometimento, cuidado, colaboracao];
    if (criterios.some(nota => nota < 0 || nota > 5)) {
        return res.status(400).send("Todas as notas devem estar entre 0 e 5.");
    }

    try {
        const mediaNota = (assiduidade + comprometimento + cuidado + colaboracao) / 4;
        const [result] = await pool.execute(
            'INSERT INTO avaliacoes (membro_id, nota, comentario, data_avaliacao) VALUES (?, ?, ?, CURDATE())',
            [membro_id, mediaNota, 'Avaliação realizada com base nos critérios de assiduidade, comprometimento, cuidado e colaboração']
        );

        res.status(201).json({ 
            id: result.insertId, 
            membro_id, 
            nota: mediaNota, 
            comentario: 'Avaliação realizada com base nos critérios de assiduidade, comprometimento, cuidado e colaboração', 
            data_avaliacao: new Date() 
        });
    } catch (error) {
        console.error('Erro ao avaliar membro:', error);
        res.status(500).send('Erro ao avaliar membro');
    }
});

module.exports = router;
