const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");

function dbConnect () {
    // mongodb+srv://dashomik:batmanshomik25@cluster0.2tpn2tm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    mongoose.connect("mongodb://localhost:27017/multer")
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
});

const Product = mongoose.model("Product", productSchema);

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        let ext = path.extname(file.originalname);
        if(ext == ".jpg"){
            cb(null,__dirname+"/public/jpg");
        }
        else{
            cb(null,__dirname+"/public/others");
        }
    },
    filename:(req,file,cb)=>{
        var name= Date.now() + path.extname(file.originalname);
        cb(null,name);
    }
})

const filter=(req,file,cb)=>{
    // let ext = file.mimetype.split("/")[1];
    let ext = path.extname(file.originalname).toLowerCase();
    if(ext==".jpeg"||ext==".png"||ext==".jpg"){
        cb(null,true);
    }else{
        cb(new Error("not supported"),false);
    }
}

const upload = multer({storage:storage,limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: filter});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/upload.html");
});

app.post("/upload", upload.single("pic"), async (req, res) => {
    console.log(req.file);
    const { name, price } = req.body;
    const filename = req.file.filename;

    try {
        const product = Product.create({ name, price, filename });
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
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal server error");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

