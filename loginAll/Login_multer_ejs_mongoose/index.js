const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const ejs = require("ejs");

const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");




// mongodb+srv://dashomik:batmanshomik25@cluster0.2tpn2tm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

function dbConnect() {
  mongoose
    .connect("mongodb://localhost:27017/loginWithMUlter")
    .then(() => {
      console.log("DB Connection successful");
    })
    .catch((error) => {
      console.log(" DB Got error");
      console.error(error.message);
    });
}
dbConnect();

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  fileName: {
    type: String,
  },
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public");
  },
  filename: (req, file, cb) => {
    var name = Date.now() + ".jpg";
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

function check(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}
app.get("/", check, async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    res.render("home", { user });
  } catch (err) {
    console.error("Error:", err);
    res.send("An error occurred");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName, password });
    if (user) {
      req.session.user = user._id;
      res.redirect("/");
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.error("Error:", err);
    res.send("An error occurred");
  }
});

app.post("/signup", upload.single("pic"), async (req, res) => {
  const { userName, password } = req.body;
  const fileName = req.file.filename;
  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      res.send("User already exists");
    } else {
      const newUser = new User.create({ userName, password, fileName });
      res.send("User added");
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

app.listen(3000, (err) => {
  if (err) {
    console.log("Error in listen");
    console.error("Listen error: ", err);
  }
  console.log("Server is running");
});
