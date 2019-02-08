const express = require("express");
const app = express();
var port = 5000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//server connection placeholder
const mysql = require("mysql");
var conn = mysql.createConnection({
  host: "awardrecognition.cmi3nkb4cxej.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "zibalteam",
  password: "zibalteam19",
  database: "awardrecognition"
});

conn.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected");
});

app.get("/", function(req, res) {
  res.send("this is the express backend homepage");
});

//example server side route function for data fetching
app.get("/employeeData", function(req, res) {
  conn.query(
    "select lastName, firstName, email, accountCreated, userId from user ORDER BY lastName",
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
});

app.post("/admin/addUser", function(req, res) {
  var msg = "";
  conn.query(
    "SELECT COUNT(*) as cnt FROM user WHERE email = ?",
    [req.body.email],
    function(err, data) {
      if (err) {
        msg = err;
      } else {
        conn.query(
          "INSERT INTO user (userClass, firstName, lastName, email, password) VALUES(?,?,?,?,?)",
          [
            req.body.userClass,
            req.body.firstName,
            req.body.lastName,
            req.body.user,
            req.body.password
          ],
          function(err) {
            if (err) {
              msg = "Email Already in Use";
              res.send(msg);
            } else {
              msg = "Successfully Added User";
              res.send(msg);
            }
          }
        );
      }
    }
  );
});

//this function will need to return whether the login is valid as well as the userclass.
app.post("/userAuth", function(req, res) {
  const { user, password } = req.body;
  var result = { valid: false, role: "", msg: "" };
  if (user === "admin" && password === "123") {
    result.valid = true;
    result.role = "administrator";
  } else if (user === "joe" && password === "schmoe") {
    result.valid = true;
    result.role = "user";
  } else {
    result.msg = "Username and password do not match";
  }
  res.json(result);
});

app.listen(port, function() {
  console.log(`server started on ${port}`);
});
