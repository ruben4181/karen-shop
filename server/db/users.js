require('dotenv').config({path:'.env'});

const connection = require('./connection');
const DB_NAME = process.env.DATABASE_NAME;
const COLL_NAME = process.env.USERS_COLLECTION_NAME;
var db;

connection.getConnection().then((conn)=>{
  db=conn;
}).catch((err)=>{
  console.log(err);
});

module.exports = {
  verifyUser: (user, password) => {
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      
      conn.collection(COLL_NAME).findOne({user : user, password : password}, (err, resp)=>{
        if(err){
          reject(err);
        } else{
          if(resp){
            resolve({
              result : 'OK',
              message : 'Access gratend'
            });
          } else{
            resolve({
              result : 'DECLINED',
              message : 'Access denied'
            })
          }
        }
      });
    });
  },
  createUser : (user, password) =>{
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).insertOne({user: user, password : password}, (err, resp)=>{
        if(err){
          reject(err);
        } else{
          if(resp.result.ok==1 && resp.result.n==1){
            resolve({
              result : 'OK',
              message : "User '"+user+"' created successfully"
            });
          } else{
            resolve({
              result : 'DECLINED',
              message : "Can't create the user"
            })
          }
        }
      });
    });
  },
  deleteUser : (user)=>{
    return new Promise((resolve, reject)=>{
      if(user=='rafael'){
        resolve({
          result : 'DECLINED',
          message : "RAFAEL Can't be deleted"
        });
      }
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).deleteOne({user : user}, (err, resp)=>{
        if(err){
          reject(err);
        } else{
          if(resp.result.ok==1){
            resolve({
              result : 'OK',
              message : 'User deleted'
            });
          } else{
            resolve({
              result : 'DECLINED',
              message : "Can't delete the user"
            });
          }
        }
      });
    });
  },
  updatePassword(user, password){
    return new Promise((resolve, reject)=>{
      let conn = db.db(DB_NAME);
      conn.collection(COLL_NAME).updateOne({user: user}, {$set : {password : password}}, (err, resp)=>{
        if(err){
          reject(err);
        } else{
          if(resp.result.ok==1 && resp.result.nModified==1){
            resolve({
              result : 'OK',
              message : 'Password updated correctly'
            });
          } else{
            resolve({
              result : 'DECLINED',
              message : 'Nothing updated'
            })
          }
        }
      });
    });
  }
};
