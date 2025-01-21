const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { type } = require("os");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + "/public"));
function dbConnect () {
  // mongodb+srv://dashomik:batmanshomik25@cluster0.2tpn2tm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    mongoose.connect("mongodb://localhost:27017/loginWithMUlter")
      .then(() => {
        console.log("DB Connection successful");
      })
      .catch((error) => {
        console.log(" DB Got error");
        console.error(error.message);
      });
    };
dbConnect();

const userSchema = new mongoose.Schema({
  userName: {
    type: String
  },
  password:{
    type: String
  },
  fileName:{
    type: String
  }
});

const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: true,
    secret: "shomik25",
  })
);


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,__dirname+"/public");
  },
  filename:(req,file,cb)=>{
      var name= Date.now() + ".jpg";
      cb(null,name);
  }
})

const upload = multer({storage:storage});


function check(req, res, next) {
  if (req.session.id2) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", check, (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName, password });
    if (user) {
      req.session.id2 = user._id;
      res.redirect("/");
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.error("Error:", err);
    res.send("An error occurred");
  }
});



app.post("/signup",upload.single("pic"), async (req, res) => {
  const { userName, password } = req.body;
  const fileName = req.file.filename;
  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      res.send("User already exists");
    } else {
      const newUser = new User({ userName, password, fileName});
      await newUser.save();
      res.send("User added");
    }
  } catch (err) {
    console.error("Error:", err);
    res.send("An error occurred");
  }
});


app.get("/api/getUser", async(req, res) => {
  const user = req.session.id2;
  console.log(user);
  try {
    const existingUser = await User.findById(user);
    if (existingUser) {
      res.send(existingUser);
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.error("Error:", err);
    res.send("An error occurred");
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in listen");
    console.error("Listen error: ", err);
  }
  console.log("Server is running");
});
