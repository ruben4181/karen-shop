require('dotenv').config({path:'.env'});
const connection = require('./connection');
const DB_NAME = process.env.DATABASE_NAME;
const COLL_NAME = process.env.PRODUCTS_COLLECTION_NAME;
var db;

connection.getConnection().then((conn)=>{
  db = conn;
}).catch((err)=>{
  console.log(err);
});

module.exports = {
  productSold : (id, unitsSold)=>{
    return new Promise((resolve, reject)=>{
      module.exports.getProductByID(id).then((resp)=>{
        if(resp){
          let units = Number(resp.units) - Number(unitsSold);
          let conn = db.db(DB_NAME);
          conn.collection(COLL_NAME).updateOne({id}, {$set : {units}}, (err, resp)=>{
            if(err){
              console.log(err);
              reject(err);
            } else{
              if(resp.result.nModified>0){
                resolve({result: 'OK', message: 'Producto actualizado'});
              } else{
                resolve({result : 'FAIL', message : 'Nohing updated'});
              }
            }
          });
        } else{
          resolve({
            result : 'FAIL',
            message : 'Producto no existe'
          })
        }
      }).catch((err)=>{
        console.log(err);
        reject(err);
      });
    });
  },
  getProductByID : (id)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      const projection = {
        _id : 0
      }
      conn.collection(COLL_NAME).findOne({id : id}, {projection}, (err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      });
    });
  },
  getProductsByStore : () =>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      const projection = {
        _id : 0
      }
      conn.collection(COLL_NAME).find({}, {projection}).toArray((err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      });
    });
  },
  getProductsByCategory : (category) =>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      const projection = {
        _id : 0
      }
      conn.collection(COLL_NAME).find({category}, {projection}).toArray((err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      });
    });
  },
  createProduct : (product) =>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      module.exports.getProductByID(product.id).then((resp)=>{
        if(!resp){
          conn.collection(COLL_NAME).insertOne(product, (err, resp)=>{
            if(err){
              console.log(err);
              reject(err);
            } else{
              if(resp.result.ok==1){
                resolve({
                  result : 'OK',
                  message : 'Product created successfully'
                });
              } else{
                resolve({
                  result : 'FAIL',
                  message : 'Product was not created successfully'
                });
              }
            }
          });
        } else{
          resolve({
            result : 'FAIL',
            message : 'Product already exists'
          });
        }
      }).catch((err)=>{
        console.log(err);
        reject(err);
      })
    });
  },
  deleteProductByID : (id)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).deleteMany({id}, (err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          if(resp.result.n>0){
            resolve({
              result : 'OK',
              message : 'Product deleted successfully'
            });
          } else{
            resolve({
              result : 'FAIL',
              message : 'Nothing deleted'
            });
          }
        }
      });
    });
  },
  updateProduct : (id, changes)=>{
    return new Promise((resolve, reject)=>{
      module.exports.getProductByID(id).then((resp)=>{
        if(resp){
          let conn = db.db(DB_NAME);
          conn.collection(COLL_NAME).updateOne({id : id}, {$set : changes}, (err, resp)=>{
            if(err){
              reject(err);
            } else{
              if(resp.result.nModified>0){
                resolve({
                  result : 'OK',
                  message : 'Producto actualizado correctamente'
                });
              } else{
                resolve({
                  result : 'FAIL',
                  message : 'Nothing updated'
                });
              }
            }
          });
        } else{
          resolve({
            result : 'FAIL',
            message : 'El producto no existe'
          });
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  }
}
