const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

const dbUrl = "mongodb://localhost:27017/loginWithMUlter";
let db, usersCollection;

async function dbConnect() {
    try {
        const client = new MongoClient(dbUrl);
        await client.connect();
        db = client.db("loginWithMUlter");
        usersCollection = db.collection("users");
        console.log("DB Connection successful");
    } catch (error) {
        console.log("DB Got error");
        console.error(error.message);
    }
}
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.delete("/deleteRecord/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return res.json({ msg: true });
        } else {
            return res.json({ msg: false });
        }
    } catch (err) {
        console.error("we got error", err);
        return res.json({ msg: false });
    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.error("got error", err);
    } else {
        console.log("Server is running on port", PORT);
    }
});
