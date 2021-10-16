const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Router = require('./routers/user'); // api 
const db= mongoose.connection;
const cors = require('cors')

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/Authentication");

app.use(cors())


db.once("open", () =>{
    console.log("connected to database");
})


// Pares Body to Json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', Router);

console.log((require('crypto').randomBytes(64).toString('hex')));

app.listen(5000,()=>console.log("listening to server " + 5000))
