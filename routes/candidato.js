const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extName) {
            return cb(null, true);
        }
        cb(new Error('Apenas arquivos PDF são permitidos!'));
    }
});


router.post('/', upload.single('curriculo'), async (req, res) => {
    const { nome, email, cargoDesejado } = req.body;
    const curriculoPath = req.file ? req.file.path : null;

    if (!curriculoPath) {
        return res.status(400).send('O envio do arquivo PDF é obrigatório.');
    }

    try {
       
        const [result] = await pool.execute(
            'INSERT INTO curriculos (nome, email, cargo_desejado, caminho_arquivo) VALUES (?, ?, ?, ?)',
            [nome, email, cargoDesejado, curriculoPath]
        );

        res.status(201).json({
            mensagem: 'Currículo enviado com sucesso!',
            curriculoId: result.insertId
        });
    } catch (error) {
        console.error('Erro ao enviar currículo:', error);
        res.status(500).send('Erro ao enviar currículo');
    }
});

module.exports = router;
