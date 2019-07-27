const express = require('express');

const app = express();


app.use(require('./controllers/usuario'));
app.use(require('./controllers/login'));
app.use(require('./controllers/categorias'));
app.use(require('./controllers/productos'));
app.use(require('./controllers/uploads'));

module.exports = app;