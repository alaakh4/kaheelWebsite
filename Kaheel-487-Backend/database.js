const mongoose = require('mongoose');
let dbUrl='mongodb://localhost:27017/kaheel7'
const uri = "mongodb+srv://alaa:pDYaXPwYH1XO0RIL@cluster0-mpkhx.mongodb.net/kaheel7?retryWrites=true&w=majority";
// mongoDB conection
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }) // DeprecationWarning solved
  .then(() => {
    console.log('connected to local database');
  })
  .catch((err) => {
    console.log(err);
     mongoose.connect("mongodb://localhost:27017/ptp")
       .then(() => {
         console.log('connected to local database')
       })
       .catch(() => {
         console.log('failed to connect to local database')
       })
  });
 /* 
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/