require('dotenv').config({path:'.env'});
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

let server = http.createServer(app);

app.use(cors({origin:true,credentials:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./routes/index'));

let port = process.env.PORT || 3001
server.listen(port, ()=>{
  console.log('Server running on port: '+port);
})
