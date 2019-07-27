const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const Categoria = require('../models/categoria');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {

    let usuario = req.usuario;

    Categoria.find({})
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });


        });

});


app.get('/categoria/:id', verificaToken, (req, res) => {

    const { id } = req.params;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'Não exite essa categoria'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriadb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriadb) {
            return res.status(401).json({
                ok: false,
                message: 'Seu usuario não possui permissão para criar uma categoria'
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb
        });


    })

});


app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findOneAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaAtualizada) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensagem: 'Você não possui altorização para modificar essa categoria'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaAtualizada
        });

    });


});


app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findOneAndRemove(id, (err, categoriaRemovida) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaRemovida) {
            return res.status(401).json({
                ok: false,
                menssagem: 'Voçê não possui altorização para excluir essa categoria.'
            })
        }

        res.json({
            ok: true,
            categoria: 'ok'
        })

    })

});


module.exports = app;