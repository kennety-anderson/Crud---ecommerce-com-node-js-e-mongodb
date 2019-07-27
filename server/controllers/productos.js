const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const Producto = require('../models/producto');

const app = express();


app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limit || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: true,
                    err: 'Não existem produtos para se listar'
                });
            }

            res.json({
                ok: true,
                produto: productos
            });

        });

});

app.get('/producto/:id', verificaToken, (req, res) => {

    const { id } = req.params;

    Producto.findById(id)
        .populate('usuario', 'nome email')
        .populate('categoria')
        .exec((err, produto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!produto) {
                return res.status(400).json({
                    ok: false,
                    err: 'Este produto não existe'
                });
            }

            if (produto.disponible === false) {
                return res.status(400).json({
                    ok: false,
                    err: 'Este produto não existe'
                });
            }

            res.json({
                ok: true,
                produto
            });
        });

});

app.get('/producto/buscar/:termino', [verificaToken, verificaAdmin_Role], (req, res) => {

    const { termino } = req.params;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    err: 'Este produto não existe.'
                });
            }

            res.json({
                ok: true,
                pruduto: productoDB
            });

        });

});

app.post('/producto', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


app.put('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    const { id } = req.params;
    let body = req.body;

    let atualizarProduto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        // disponible: body.disponible,
        // categoria: body.categoria
    };

    Producto.findOneAndUpdate(id, atualizarProduto, { new: true, runValidators: true }, (err, produtoAtualizado) => {

        if (err) {
            return res.status(501).json({
                ok: false,
                err
            });
        }

        if (!produtoAtualizado) {
            return res.status(400).json({
                ok: false,
                err: 'Produto não existe'
            });
        }

        res.json({
            ok: true,
            producto: produtoAtualizado
        });

    })

});


app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    const { id } = req.params;

    Producto.findOneAndUpdate(id, { disponible: false }, { new: true }, (err, productoRemovido) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoRemovido) {
            return res.status.json({
                ok: false,
                err: 'Esse produto não existe.'
            });
        }

        res.json({
            ok: true,
            producto: productoRemovido
        });

    });

});


module.exports = app;