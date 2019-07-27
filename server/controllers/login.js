const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let { email, password } = req.body;

    Usuario.findOne({ email: email }, (err, ususarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err: 'erro no server'
            });
        }

        if (!ususarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) ou contraseha incorretos'
                }
            });

        }

        if (password === ususarioDB.password) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario ou (contrasena) incorretos'
                }
            });
        }

        //geranco o token com expiração de 30 dias 
        let token = jwt.sign({ data: ususarioDB }, 'abc-123-def-456*', { expiresIn: 60 * 60 * 24 * 30 });


        res.json({
            ok: true,
            usuario: ususarioDB,
            token
        });

    });

});

module.exports = app;