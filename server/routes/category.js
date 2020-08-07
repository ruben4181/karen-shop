const express = require('express');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/category')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

var upload = multer({storage});

const app = express();

const services = require('../db/category');

app.get('/inventory/category/resource', (req, res)=>{
  let resource = req.query.resource;
  res.download(resource);
});

app.get('/inventory/categories', (req, res)=>{
  let parent = req.query.parent || 'no-parent';
  let where = {parent}
  if(parent=='all'){
    where = {}
  }
  services.getCategories(where).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al obtener las categorias',
      err : err
    });
  });
});

app.get('/inventory/category', (req, res)=>{
  let id = req.query.id;
  services.getCategory(id).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    console.log(err);
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al obtener la categoria',
      err : err
    });
  });
});

app.post('/inventory/new-category', upload.single('file'), (req, res)=>{
  //var {filename} = storeWithOriginalName(req.file);
  let body = req.body;
  let category = {
    id : body.id,
    name : body.name,
    description : body.description,
    tags : body.tags,
    parent : body.parent,
    image : req.file ? req.file.path : 'no-image'
  }

  services.createCategory(category).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    console.log(err);
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al crear la categoría',
      err : err
    });
  });
});

app.get('/inventory/del-category', (req, res)=>{
  let id = req.query.id;
  console.log(id);
  services.deleteCategory(id).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    console.log(err);
    res.send({
      result : 'ERROR',
      message : 'Error al borrar categoría',
      err : err
    });
  })
});

app.post('/inventory/update-category', upload.single('file'), (req, res)=>{
  let body = req.body;
  let id = body.id;
  console.log(id);
  let changes = {
    name : body.name,
    description : body.description,
    parent : body.parent,
    tags : body.tags
  }

  if(req.file){
    changes.image = req.file.path;
  }

  services.updateCategory(id, changes).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send({
      result : 'ERROR',
      message : 'Error al actualizar la categoría',
      err : err
    });
  });
});

app.post('/upload', upload.single('file'), (req, res)=>{
  res.send({file: req.file,
    body : req.body
  });
})

module.exports=app;
