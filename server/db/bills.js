require('dotenv').config({path:'.env'});
const connection = require('./connection');
const DB_NAME = process.env.DATABASE_NAME;
const COLL_NAME = process.env.BILLS_COLLECTION_NAME;
var db;

connection.getConnection().then((conn)=>{
  db = conn;
}).catch((err)=>{
  console.log(err);
});

module.exports = {
  getBillsByFilter : (where)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).find(where).toArray((err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      });
    });
  },
  getBillByID : (id)=>{
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
  createBill : (bill)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).insertOne(bill, (err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          if(resp.result.ok==1){
            resolve({
              result : 'OK',
              message : 'Factura guardada con exito'
            });
          } else{
            resolve({
              result : 'FAIL',
              message : 'Factura no se guardó correctamente'
            });
          }
        }
      });
    })
  },
  updateBill : (id, changes)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).updateOne({id}, {$set : changes}, (err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          if(resp.result.nModified>0){
            resolve({
              result : 'OK',
              message : 'Factura actualizada correctamente'
            });
          } else{
            resolve({
              result : 'FAIL',
              message : 'Nothing updated'
            });
          }
        }
      });
    });
  }
}