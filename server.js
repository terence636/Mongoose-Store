require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT

// MondoDB Setup
const mongoose = require('mongoose');
const Product = require('./models/product.js');
const Sample = require('./models/sample.js');
const mongoURI = "mongodb://localhost:27017/products";
const db = mongoose.connection;

// CONFIG - MONGODB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});
//

const sample = require('./models/sample.js');

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.get("/sample",(req,res)=>{
    res.send(Sample)
})

app.listen(PORT,()=>{
    console.log("listening at port",PORT)
})