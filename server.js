require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT

//Setup middleware
//Middleware
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(methodOverride("_method"))

// MondoDB Setup
const mongoose = require('mongoose');
const Product = require('./models/product.js');
const Sample = require('./models/sample.js');
const mongoURI = "mongodb://localhost:27017/products";


// CONFIG - MONGODB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});
const db = mongoose.connection;
//

const sample = require('./models/sample.js');

// Seed Data
app.get('/seed', async (req, res) => {
    const newProducts =
      [
        {
          name: 'Beans',
          description: 'A small pile of beans. Buy more beans for a big pile of beans.',
          img: 'https://cdn3.bigcommerce.com/s-a6pgxdjc7w/products/1075/images/967/416130__50605.1467418920.1280.1280.jpg?c=2',
          price: 5,
          qty: 99
        }, {
          name: 'Bones',
          description: 'It\'s just a bag of bones.',
          img: 'http://bluelips.com/prod_images_large/bones1.jpg',
          price: 25,
          qty: 0
        }, {
          name: 'Bins',
          description: 'A stack of colorful bins for your beans and bones.',
          img: 'http://www.clipartbest.com/cliparts/9cz/rMM/9czrMMBcE.jpeg',
          price: 7000,
          qty: 1
        }
      ]
  
    try {
      const seedItems = await Product.create(newProducts)
      res.send(seedItems)
    } catch (err) {
      res.send(err.message)
    }
})

// FOR TESTING
app.get("/",(req,res)=>{
    res.send("Hello")
})
app.get("/sample",(req,res)=>{
    res.send(Sample)
})

// FOR INDEX
app.get("/products",(req,res)=>{
    Product.find({},(error,allProducts)=>{
        res.render("index.ejs",{allProducts})
    })
    
})

// CREATE NEW PRODUCT
app.get("/products/new",(req,res)=>{
    res.render("new.ejs",{})
})

app.post("/products", (req,res)=>{
    console.log(req.body)
    Product.create(req.body,(error,cretedProduct)=>{
        res.redirect("/products");
      })    
})

// FOR SHOW INDIVIDUAL ITEM
app.get("/products/:id",(req,res)=>{
    Product.findById(req.params.id,(error,product)=>{
        res.render("show.ejs",{product,pos:req.params.id})
    })
    
    
})

// BUY UPDATE
app.put("/products/buy/:id", (req, res) => {
    
    let newQty = 0;
    Product.findById(req.params.id,(error,product)=>{
        newQty = product.qty + 1;
        Product.findOneAndUpdate({_id:req.params.id},{qty:newQty},{new:true},(error,product)=>{
            console.log(product)
            res.redirect(`/products/${req.params.id}`);
        })
    })
    
    
});

// EDIT PRODUCT
app.get("/products/edit/:id",(req,res)=>{
    Product.findById(req.params.id,(error,product)=>{
        res.render("edit.ejs",{product,pos:req.params.id})
    })
})

app.put("/products/edit/:id", (req, res) => {
    
    console.log("body",req.body)
    Product.findByIdAndUpdate(req.params.id,req.body,{new:true},(error,updateProduct)=>{
            console.log("after",updateProduct)
            res.redirect("/products");
        })    
});

// DELETE PRODUCT
app.delete('/products/:index', (req, res) => {
    Product.findByIdAndRemove(req.params.index,()=>{
      res.redirect('/products');  
    })
});



// FOR LISTEN TO LOCAL HOST
app.listen(PORT,()=>{
    console.log("listening at port",PORT)
})