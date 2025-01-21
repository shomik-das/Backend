const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const session = require("express-session");
const cookie = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());
app.use(session({
    saveUninitialized: true,
    secret: "shomik25"
}))

function check (req,res,next){
    if(req.session.user){
        next();
    }
    else{
        res.redirect("/login");
    }
}

app.get('/', check, (req,res)=>{
    res.sendFile(__dirname + "/home.html");
})

app.get('/login', (req,res)=>{
    res.sendFile(__dirname + "/login.html");
})
app.get('/signup', (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
})

app.post('/login',(req,res)=>{
    const {userName, password} = req.body;
    fs.readFile("./users.json", "utf-8", (err,data)=>{
        if(err){
            console.log("error read the file");
            console.error("read error is : ",err);
        }
        else{
            const users = JSON.parse(data);
            let userHere = false;
            users.forEach((user)=>{
                if(user.userName == userName && user.password == password){
                    userHere = true;
                }
            })
            if(userHere){
                req.session.user = userName;
                res.redirect("/");
                return;
            }
            else{
                res.send("user not found");
            }
        }
    })
})

app.post('/signup',(req,res)=>{
    const {userName, password} = req.body;
    fs.readFile("./users.json", "utf-8", (err,data)=>{
        if(err){
            console.log("error read the file");
            console.error("read error is : ",err);
            return;
        }
        else{
            const users = JSON.parse(data);
            let userHere = false;
            users.forEach((user)=>{
                if(user.userName == userName){
                    userHere = true;
                }
            })
            if(userHere){
                res.send("user already here");
                return;
            }
            else{
                users.push({userName, password});
                fs.writeFile("./users.json",JSON.stringify(users), (err)=>{
                    if(err){
                        console.log("error write the file");
                        console.error("write error is : ",err);
                        return;
                    }
                    else{
                        res.send("user added");
                        return;
                    }
                })
            }
        }
    })
})

app.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/login");
})


app.listen(PORT,(err)=>{
    if(err){
        console.log("error in listen");
        console.error("listen error: ", err);
    }
    console.log("sever is running");
})

