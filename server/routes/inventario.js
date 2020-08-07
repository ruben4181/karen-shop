const express = require('express');
const app = express();

app.get('/inventario/test', (req, res)=>{
	res.send({
		result : 'OK',
		message : 'Inventario is running right'
	});
});

module.exports = app;
