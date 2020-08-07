require('dotenv').config({path:'.env'});
var mongoClient = require('mongodb').MongoClient;
//The URL to connecto to MongoDB, changes to the right options on .env file
var urlConnection = 'mongodb://'+process.env.DATABASE_USER+':'+process.env.DATABASE_PASSWORD+
    '@'+process.env.DATABASE_HOST+':'+process.env.DATABASE_PORT;

//The functions that the file will provide

module.exports = {
    //It returns a new connection to mongoDB
    getConnection : ()=>{
        return new Promise((resolve, reject) => {
            mongoClient.connect(urlConnection, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db)=>{
                if(err){
                    console.log("There was an connection error to MongoDB\n\n", err);
                    reject(err);
                } else{
                    console.log("Successful connection to MongoDB");
                    resolve(db)
                }
            })
        });
    }
}
