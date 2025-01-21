const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/todo.json");
});

app.get("/homepage", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});

app.post('/addtask', (req, res) => {
    const { name, id } = req.body;

    if (!name || !id) {
        res.send("Please provide a title, id, and status.");
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

const fs = require("fs");

app.get("/delete", (req, res) => {
    const name = req.query.name;
    fs.readFile(__dirname + "/todo.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error");
            return;
        }
        let allData = JSON.parse(data);
        const newAllData = allData.filter((obj) => obj.name !== name);
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


app.post('/updateTask', (req, res) => {
    const { id, name } = req.body;
    fs.readFile('todo2.json', 'utf8', (err, data) => {
        if (err) {
            res.send(err.message);
            return;
        }
        let tasks = JSON.parse(data);
        let updated = false;
        tasks.forEach(task => {
            if (task.id === id) {
                task.name = name;
                updated = true;
            }
        });
        if (updated) {
            fs.writeFile('todo.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    res.send('Error writing file.');
                    return;
                }
                res.send('Task updated successfully.');
            });
        } else {
            res.send("Task with provided id not found.");
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






// invalid count make errors.log error.json file 

// const express = require("express");
// const app = express();
// const fs = require("fs");
// const path = require("path");

// let invalidRequestCount = 0;

// const logInvalidRequest = (req, res, next) => {
//     invalidRequestCount++;
//     const logEntry = {
//         url: req.url,
//         timestamp: new Date().toISOString()
//     };
    
//     fs.readFile(path.join(__dirname, "error.json"), "utf-8", (err, data) => {
//         let errors = [];
//         if (!err && data) {
//             try {
//                 errors = JSON.parse(data);
//             } catch (jsonErr) {
//                 console.error("Error parsing JSON", jsonErr);
//             }
//         }
//         errors.push(logEntry);
//         fs.writeFile(path.join(__dirname, "error.json"), JSON.stringify(errors, null, 2), (writeErr) => {
//             if (writeErr) {
//                 console.error("Error writing to error.json", writeErr);
//             }
//         });
//     });

//     const logMessage = `URL: ${req.url}, Timestamp: ${logEntry.timestamp}\n`;
//     fs.appendFile(path.join(__dirname, "errors.log"), logMessage, (err) => {
//         if (err) {
//             console.error("Error writing to errors.log", err);
//         }
//     });

//     res.send(`invalid with count: ${invalidRequestCount}`);
// };

// app.get("/about", logInvalidRequest);
// app.get("/home", logInvalidRequest);
// app.get("*", logInvalidRequest);

// app.get("/showrequest", (req, res) => {
//     fs.readFile(path.join(__dirname, "error.json"), "utf-8", (err, data) => {
//         if (err) {
//             return res.status(500).send("Internal Server Error");
//         }
//         res.send(data);
//     });
// });

// app.listen(3000, () => {
//     console.log("Server started on port 3000");
// });
