const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

function dbConnect() {
  // mongodb+srv://dashomik:batmanshomik25@cluster0.2tpn2tm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  mongoose
    .connect("mongodb://localhost:27017/database")
    .then(() => {
      console.log("DB Connection successful");
    })
    .catch((error) => {
      console.log(" DB Got error");
      console.error(error.message);
    });
}
dbConnect();

const playerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  game: String,
});

const Player = mongoose.model("Player", playerSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const players = await Player.find({});
    res.render("index", { players });
  } catch (err) {
    res.send(err);
  }
});

app.post("/search", async (req, res) => {
  const { name, age, game } = req.body;
  let filter = {};

  if (name) {
    filter.name = name;
  }
  if (age) {
    filter.age = age;
  }
  if (game) {
    filter.game = game;
  }

  try {
    const players = await Player.find(filter);
    res.render("index", { players });
  } catch (err) {
    res.send(err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});