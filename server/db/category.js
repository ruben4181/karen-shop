require('dotenv').config({path:'.env'});
const connection = require('./connection');
const DB_NAME = process.env.DATABASE_NAME;
const COLL_NAME = process.env.CATEGORY_COLLECTION_NAME;
var db;

connection.getConnection().then((conn)=>{
  db=conn;
}).catch((err)=>{
  console.log(err);
});

module.exports={
  getCategories : (where)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      let projection = {
        _id : 0
      };
      conn.collection(COLL_NAME).find(where, {projection}).toArray((err, resp)=>{
        if(err){
          console.log(err);
          reject(err);
        } else{
          resolve(resp);
        }
      })
    });
  },
  getCategory : (id)=>{
    return new Promise((resolve, rejection)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).findOne({id: id}, {projection : {_id : 0}}, (err, resp)=>{
        if(err){
          rejection(err)
        } else{
          resolve(resp);
        }
      });
    });
  },
  createCategory : (category)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      module.exports.getCategory(category.id).then((resp)=>{
        if(!resp){
          conn.collection(COLL_NAME).insertOne(category, (err, resp)=>{
            if(err){
              resolve({
                result : 'ERROR',
                message : 'Error while creating category(Inserting)'
              });
            } else{
              if(resp.result.ok==1){
                resolve({
                  result : 'OK',
                  message : 'Category created successfully'
                });
              } else{
                resolve({
                  result : 'FAIL',
                  message : 'Categeroy was not created successfully'
                })
              }
            }
          });
        } else{
          resolve({
            result : 'FAIL',
            message : 'Category already exists'
          })
        }
      }).catch((err)=>{
        reject({
          result : 'ERROR',
          message : 'Error while creating category(Findinf ID)'
        })
      })
    });
  },
  deleteCategory : (id) =>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).deleteMany({id : id}, (err, resp)=>{
        if(err){
          resolve({
            result : 'ERROR',
            message : 'Error while deleting category'
          });
        } else{
          if(resp.result.n>0){
            resolve({
              result : 'OK',
              message : 'Category deleted successfully'
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
  updateCategory : (id, changes)=>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      module.exports.getCategory(id).then((resp)=>{
        if(resp){
          conn.collection(COLL_NAME).updateOne({id : id}, {$set : changes}, (err, resp)=>{
            if(err){
              resolve({
                result : 'ERROR',
                message : 'Error while updating category'
              });
            } else{
              if(resp.result.nModified>0){
                resolve({
                  result : 'OK',
                  message : 'Category updated successfully'
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
            message : 'Categoría no existe'
          });
        }
      }).catch((err)=>{
        console.log(err);
        resolve({
          result : 'ERROR',
          message : 'Error while updating category(FINDING ID)'
        });
      })
    });
  }
}
