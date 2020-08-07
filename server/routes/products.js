const express = require('express');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/products')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

var upload = multer({storage});
const app = express();
const services = require('../db/products');

app.get('/inventory/product', (req, res)=>{
  let id = req.query.id;
  services.getProductByID(id).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al obtener el producto',
      err : err
    });
  });
});

app.get('/inventory/products', (req, res)=>{
  let category = req.query.category;
  if(category){
    services.getProductsByCategory(category).then((resp)=>{
      res.status(200);
      res.send(resp);
    }).catch((err)=>{
      res.status(500);
      res.send({
        result : 'ERROR',
        message : 'Error al obtener categorías',
        err : err
      });
    });
  }else{
    services.getProductsByStore().then((resp)=>{
      res.status(200);
      res.send(resp);
    }).catch((err)=>{
      res.status(500);
      res.send({
        result : 'ERROR',
        message : 'Error al obtener los productos',
        err : err
      });
    });
  }
});

app.get('/inventory/delete-product', (req, res)=>{
  let id = req.query.id;
  console.log(id);
  services.deleteProductByID(id).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al eliminar el producto'
    });
  });
});

app.post('/inventory/add-product', upload.single('file'), (req, res)=>{
  let body = req.body;
  let product = {
    id : body.id,
    name : body.name,
    content : body.content,
    brand : body.brand,
    description : body.description==='' ? undefined : body.description,
    price_in : body.price_in,
    price_out : body.price_out,
    units : body.units,
    category : body.category,
    image : req.file ? req.file.path : 'no-image'
  }

  services.createProduct(product).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al guardar el producto',
      err : err
    });
  });
});

app.post('/inventory/update-product', upload.single('file'), (req, res)=>{
  let body = req.body;
  let id = body.id;
  let changes = {
    name : body.name,
    content : body.content,
    brand : body.brand,
    description : body.description,
    price_in : body.price_in,
    price_out : body.price_out,
    category : body.category,
    units : body.units
  };

  if(req.file){
    changes.image = req.file.path
  }

  services.updateProduct(id, changes).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al actualizar el producto',
      err : err
    });
  });
});
module.exports=app;
