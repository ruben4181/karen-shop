const express = require('express');
const app = express();

const services = require('../db/loans');
const bills = require('../db/bills');

app.get('/loans', (req, res)=>{
  services.getLoansByFilter({}).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERR0R',
      message : 'Error al obtener los creditos',
      err
    });
  });
});

app.post('/loans', (req, res)=>{
  let filter = req.body.filter;

  services.getLoansByFilter(filter).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al obtener las factuas',
      err
    })
  })
});

app.post('/loans/new-loan', (req, res)=>{
  let loan = req.body.loan;
  services.createLoan(loan).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al crear el credito',
      err
    });
  });
});

app.post('/loans/update-loan', (req, res)=>{
  let id = req.body.id;
  let changes = req.body.changes;

  if(changes.total<=0){
    bills.updateBill(changes.idBill, {isLoan : false});
  }

  services.updateLoan(id, changes).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    console.log(err);
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al actualizar el credito',
      err
    });
  });
});

timeStamp = ()=>{
  var today = new Date(); 
  var dd = today.getDate(); 
  var mm = today.getMonth() + 1; 

  var yyyy = today.getFullYear(); 
  if (dd < 10) { 
      dd = '0' + dd; 
  } 
  if (mm < 10) { 
      mm = '0' + mm; 
  } 
  var today = dd + '-' + mm + '-' + yyyy;
  return today;
}

module.exports = app;