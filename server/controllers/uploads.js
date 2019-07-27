const express = require('express');

const fileUpload = require('express-fileupload');

const Usuario = require('../models/usuario');

const app = express();

//ativando a função para upload dos arquivos
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    const { id, tipo } = req.params;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: 'Este arquivo não pode ser atualizado'
        });
    }

    //pegar o valor de um input com o name archivo
    let sampleFile = req.files.archivo;
    //separar o nome do arquivo a onde tiver um ponto
    let separador = sampleFile.name.split('.');
    //pegar o ultimo indice apos a separação
    let extensao = separador[separador.length - 1];

    // console.log(extensao);




    //arquivos permitidos
    let arquivosPermitidos = ['png', 'jpg', 'gif', 'jpeg'];

    if (arquivosPermitidos.indexOf(extensao) < 0) {
        return res.status(400).json({
            pk: false,
            err: 'As extenções validas são ' + arquivosPermitidos.join(', ')
        });
    }


    //tipos permitidos
    let tiposValidos = ['produtos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: 'O tipo não é valido'
        });
    }



    //trocar o nome do arquivo
    //id da imagem mais os milessegundos e a extensão da imagem
    let nomeArquivo = `${id}-${new Date().getMilliseconds()}.${extensao}`

    //movendo as imagens para a pasta desejada 
    sampleFile.mv(`uploads/${tipo}/${nomeArquivo}`, (err) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        //imagem carregada
        res.json({
            ok: true,
            message: 'Upload realizado com sucesso'
        });
    });

});


module.exports = app;