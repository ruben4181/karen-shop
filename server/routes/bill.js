const express = require('express');
const app = express();

const services = require('../db/bills');
const products = require('../db/products');
const { Timestamp } = require('mongodb');

app.post('/bills', (req, res)=>{
  let filter = req.body.filter;
  services.getBillsByFilter(filter).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al intentar obtener las facturas',
      err
    });
  });
});

app.get('/bills', (req, res)=>{
  services.getBillsByFilter({}).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al intentar obtener las facturas',
      err
    });
  });
});

app.post('/biils/new-bill', (req, res)=>{
  let items = req.body.items;
  let client = req.body.client;
  let clientID = req.body.clientID;
  let seller = req.body.seller;
  let total = req.body.total;
  let isLoan = req.body.isLoan;
  let id = req.body.id;
  
  let printing = req.body.printing;

  for(let i=0; i<items.length; i++){
    products.productSold(items[i].id, items[i].unitsSelling);
  }
  let bill = {
    id : id,
    date : timeStamp(),
    client : {
      name : client,
      DNI : clientID
    },
    seller,
    items,
    total,
    isLoan
  }

  services.createBill(bill).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'No fue posible guardar la factura',
      err
    })
  })
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