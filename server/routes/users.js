const express = require('express');
const app = express();

const usersService = require('../db/users');

app.post('/verifyUser', (req, res)=>{
  let reqBody = req.body;
  let user = reqBody.user;
  let password = reqBody.password;
  usersService.verifyUser(user, password).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      resolve : 'Try later'
    });
  });
});

app.post('/createUser', (req, res)=>{
  let body = req.body;
  let user = body.user;
  let password = body.password;
  usersService.createUser(user, password).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Try later'
    });
  });
});

app.get('/deleteUser', (req, res)=>{
  let user = req.query.user;
  usersService.deleteUser(user).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Try later'
    });
  });
});

app.post('/updatePassword', (req, res)=>{
  let body = req.body;
  let user = body.user;
  let password = body.password;
  usersService.updatePassword(user, password).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Try later'
    });
  });
});

module.exports = app;
