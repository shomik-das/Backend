const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});

app.get("/getdata", (req, res) => {
    res.sendFile(__dirname + "/todo.json");
})


app.post('/addtask', (req, res) => {
    const { name, id } = req.body;

    if (!name || !id) {
        res.send("Please provide a title, id,");
        return;
    }

    fs.readFile('todo.json', 'utf8', (err, data) => {
        if (err) {
            res.send("Error reading file.");
            return;
        }

        let tasks = JSON.parse(data);

        tasks.push({ name, id });

        fs.writeFile('todo.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                res.send('Error writing file.');
                return;
            }
            res.send('Task added successfully.');
        });
    });
});


app.post("/delete", (req, res) => {
    const {id} = req.body;
    console.log(id);
    fs.readFile(__dirname + "/todo.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error");
            return;
        }
        let allData = JSON.parse(data);
        const newAllData = allData.filter((obj) => obj.id !== id);
        if (allData.length !== newAllData.length) {
            fs.writeFile(__dirname + "/todo.json", JSON.stringify(newAllData, null, 2), (err) => {
                if (err) {
                    res.status(500).send("Internal Server Error");
                    return;
                }
                res.send("Name deleted successfully.");
            });
        } else {
            res.send("Name not found.");
        }
    });
});

app.listen(port, (err) => {
    if (err) {
        console.error('Unable to start server:', err);
    } else {
        console.log('Server started on port', port);
    }
});