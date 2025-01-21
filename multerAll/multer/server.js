const express=require("express");
const app=express();
const fs = require("fs");
const multer=require("multer");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));


const storage = multer.diskStorage({
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

const upload = multer({storage:storage, limits:{ fileSize: 2 * 1024 * 1024 }, fileFilter: filter});


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/upload.html");
})
app.post("/upload",upload.single("pic"),(req,res)=>{
    console.log(req.file);
    const {name, price} = req.body;
    const filename = req.file.filename;

    fs.readFile(__dirname + "/product.json", 'utf-8', (err,data)=>{
        if(err){
            console.error("error reading file", err);
            return res.send("internal server error")
        }
        let products;
        if(data.length==0){
            products=[];
        }
        else{
            products = JSON.parse(data);
        }
       
        products.push({name,price,filename});
        fs.writeFile(__dirname + "/product.json", JSON.stringify(products), (err)=>{
            if(err){
                console.error("error write the file",err);
                return res.send("internal server error");
            }
            else{
                res.send("file received successfully");
            }
        })

    })
})

app.get("/products",(req,res)=>{
    res.sendFile(__dirname + "/products.html");
})
app.get("/api/products",(req,res)=>{
    res.sendFile(__dirname + "/product.json");
})


app.listen(3000, (err)=>{
    console.log("server started successfully");
});


