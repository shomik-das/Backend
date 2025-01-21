const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");

app.set("view engine","ejs");

function dbConnect () {
    // mongodb+srv://dashomik:batmanshomik25@cluster0.2tpn2tm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    mongoose.connect("mongodb://localhost:27017/multer") //public and views
      .then(() => {
        console.log("DB Connection successful");
      })
      .catch((error) => {
        console.log(" DB Got error");
        console.error(error.message);
      });
    };
dbConnect();


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    filename: String,
    description: String
});

const Product = mongoose.model("Product", productSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/public");
    },
    filename: (req, file, cb) => {
        var name = Date.now() + ".jpg";
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/upload.html");
});

app.post("/upload", upload.single("pic"), async (req, res) => {
    console.log(req.file);
    const { name, price ,description } = req.body;
    const filename = req.file.filename;

    try {
        const product = Product.create({ name, price, filename, description });
        res.send("file received successfully");
    } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).send("Internal server error");
    }
});

app.get("/products", (req, res) => {
    res.sendFile(__dirname + "/products.html");
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal server error");
    }
});

app.get("/crud/delete/:id", async(req, res) => {
    const {id} = req.params;
    try{
        const products = await Product.findByIdAndDelete(id);
        if(products){
            res.redirect('/products');
        }
        else{
            res.send("product not fount");
        }
    }
    catch(error){
        console.error("error delete the product:", error);
        res.send("internal server error");
    }
});

app.get("/crud/view/:id", async(req, res) => {
    const {id} = req.params;
    try{
      const product = await Product.findById(id);
      res.render("view", {product: product});
    }
    catch(err){
      console.error('Error view page:', err);
      res.status(500).send('Internal Server Error');
    }
});

app.get("/crud/update/:id", async(req, res) => {
    const {id} = req.params;
    try{
      const product = await Product.findById(id);
      res.render("update", {product: product});
    }
    catch(err){
      console.error('Error update page:', err);
      res.status(500).send('Internal Server Error');
    }
});

app.post("/crud/updateProduct", async(req, res) => {
    const {productId, productName, productPrice} = req.body;
    try{
        const products = await Product.findByIdAndUpdate(productId, { name: productName, price: productPrice });
        if(products){
            res.redirect('/products');
        }
        else{
            res.send("product not found");
        }
    }
    catch(error){
        console.error("error updating the product:", error);
        res.send("internal server error");
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

