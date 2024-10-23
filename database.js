const express = require("express");
const app = express();
const http=require('http').Server(app);
const bodyParser = require("body-parser");
const cors = require("cors")
const path = require("path");

const mysql = require("mysql2");
const db = mysql.createConnection({
    host:'localhost',
    user:'Rudra',
    password:'0599',
    database:'shree_p'
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/signin", function(req, res){
    res.sendFile(path.join(__dirname,"public","signin.html"));
});
app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname,"public","login.html"));
});
app.get("/index", function(req, res){
    res.sendFile(path.join(__dirname,"public","index.html"));
});
app.get("/forgot", function(req, res){
  res.sendFile(path.join(__dirname, "public", "Forgot.html"));
});
app.get("/delivery/p1", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p1.html"));
});
app.get("/delivery/p2", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p2.html"));
});
app.get("/delivery/p3", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p3.html"));
});
app.get("/delivery/p4", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p4.html"));
});
app.get("/delivery/p5", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p5.html"));
});
app.get("/delivery/p6", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p6.html"));
});
app.get("/delivery/p7", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p7.html"));
});
app.get("/delivery/p8", function(req,res){
  res.sendFile(path.join(__dirname, "public","products/p8.html"));
});
app.get("/cart", function(req,res){
  res.sendFile(path.join(__dirname, "public","cart.html"));
});

db.connect(function(err){
  if (err)throw err;
  console.log("Connected to database");
});

app.post("/signinForm", function(req, res){
  const { uemail, uname, npassword } = req.body;
    
    const query = "INSERT INTO user (uname, uemail, upassword) VALUES (?,?,?)";
    db.query(query, [uname, uemail, npassword], function(err, results){
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Error inserting data into the database");
      } else {
        res.redirect("/login");
      }
    });
  });

app.post("/loginForm", function(req, res){
  const { uname, npassword } = req.body;

    const query = "SELECT * FROM user WHERE uname = ? AND upassword = ?";
    db.query(query, [uname,npassword], function(err, results){
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).send("Error fetching data from the database");
      } else {
        if (results.length > 0) {
          const userName = results[0].uname;
          res.redirect(`/index?userName=${userName}`);
        } else {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
      }
  });
});

app.post("/forgotpass", function(req, res){
  const { uname, upassword } = req.body;

  const query = "UPDATE user SET upassword = ? WHERE uname = ?";
  db.query(query, [upassword, uname], (err, results) => {
    if (err) {
      console.error("Error updating password:", err);
      res.status(500).send("Error updating password");
    } else {
      if (results.affectedRows > 0) {
        res.redirect("/login");
      } else {
        res.json({ success: false, message: "User not found" });
      }
    }
  });
});

app.post("/addressForm", function(req,res){
  const { quantity, address, phone, } = req.body;
  const { pName, price } = req.body;

  const query = "Insert into delivery (address,quantity,phone_no,pName,price) Values (?,?,?,?,?)";
  db.query(query,[address, quantity, phone, pName, price], function(err,results){
    if(err){
      console.error("Error inserting data:", err);
      res.status(500).send("Error submitting order");
    }
    else{
      res.redirect("/index");
    }
  });
});

app.post("/cartForm", function(req,res){
  const { quantity, phone, } = req.body;
  const { pName, address, tprice } = req.body;

  const query = "Insert into cart (address,quantity,phone_no,pName,tprice) Values (?,?,?,?,?)";
  db.query(query,[address, quantity, phone, pName, tprice], function(err,results){
    if(err){
      console.error("Error inserting data:", err);
      res.status(500).send("Error submitting order");
    }
    else{
      res.redirect("/index");
    }
  });
});

app.listen(6161, () => {
    console.log("Server is running on http://localhost:6161");
});
