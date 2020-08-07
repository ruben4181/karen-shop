const express = require('express');
const app = express();

app.use(require('./inventario.js'));
app.use(require('./category.js'));
app.use(require('./products.js'));
app.use(require('./users.js'));
app.use(require('./bill'));
app.use(require('./loans'));

module.exports = app;
