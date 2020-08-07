require('dotenv').config({path:'.env'});
const connection = require('./connection');
const DB_NAME = process.env.DATABASE_NAME;
const COLL_NAME = process.env.LOANS_COLLECTION_NAME;
var db;

connection.getConnection().then((conn)=>{
  db = conn;
}).catch((err)=>{
  console.log(err);
});

module.exports = {
  getLoansByFilter : (filter)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).find(filter).toArray((err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      })
    });
  },
  getLoanByID : (id)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      let projection = {
        _id : 0
      }
      conn.collection(COLL_NAME).findOne({id}, {projection}, (err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      });
    });
  },
  createLoan : (loan)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).insertOne(loan, (err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          if(resp.result.ok==1){
            resolve({
              result : 'OK',
              message : 'Credito creado correctamente'
            });
          } else{
            resolve({
              result : 'FAIL',
              message : 'No se pudo guardar el credito'
            });
          }
        }
      });
    });
  },
  updateLoan : (id, changes)=>{
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
              message : 'Credito actualizado'
            });
          } else{
            resolve({
              result : 'FAIL',
              message : 'Nothing updated'
            });
          }
        }
      })
    });
  }
}