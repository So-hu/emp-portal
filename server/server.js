const express = require("express");
const app = express();
var port = 5000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var bcrypt = require('bcryptjs')


const mysql = require("mysql");
const config = require("./config.js");
var conn = mysql.createConnection(config);

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
    "select lastName, firstName, email, userClass, accountCreated, id from user ORDER BY lastName",
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
});

//Get awards history
app.get("/awardsData", function(req, res) {
  conn.query(
    "SELECT date, awardType.name as type,  employee.firstName as recipientFirst, \
    employee.lastName as recipientLast, user.firstName as creatorFirst, \
    user.lastName as creatorLast FROM awardrecognition.awardGiven \
    JOIN awardType on awardGiven.awardTypeID=awardType.id \
    JOIN employee on awardGiven.recipientID=employee.id \
    JOIN user on awardGiven.creatorID=user.id \
    ORDER BY date DESC;",
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
        // Get datetime in mysql-friendly format
        var timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash("abc123", salt, function(err,hash){
            conn.query(
              "INSERT INTO user (userClass, firstName, lastName, email, password, accountCreated) VALUES(?,?,?,?,?,?)",
              [
                req.body.userClass,
                req.body.firstName,
                req.body.lastName,
                req.body.user,
                hash,
                timestamp
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
          });
        })
      }
    }
  );
});

app.post("/user/addAward", function(req, res) {
  var msg = "";
  conn.query(
    "SELECT id from employee WHERE firstName=? AND lastName=? AND email=?",
    [req.body.firstName, req.body.lastName, req.body.email],
    function(err, result) {
      if (err) {
        msg = "Error with request";
        console.log(err);
        res.send(msg);
      } else if (result.length == 0) {
        msg = "User not found";
        res.send(msg);
      } else {
        //Use id from above query to find the recipient
        recipientID = result[0].id;
        //TODO: get creatorID from currently logged in user
        creatorID = 1;
        conn.query(
          "INSERT INTO awardGiven (awardTypeID, recipientID, creatorID, date, time) VALUES(?,?,?,?,?)",
          [
            req.body.awardTypeID,
            recipientID,
            creatorID,
            req.body.date,
            req.body.time
          ],
          function(err) {
            if (err) {
              console.log(err);
              msg = "Award failed.";
              res.send(msg);
            } else {
              msg = "Award successfully granted.";
              res.send(msg);
            }
          }
        );
      }
    }
  );
});

app.post("/admin/editUser", function(req, res) {
  var changes = {
    userClass: req.body.userClass,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.user
  };
  if (req.body.password != "") {
    changes.password = req.body.password;
  }
  conn.query(
    "UPDATE user SET ?  WHERE id = ?",
    [changes, req.body.id],
    function(err) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Successfully updated user");
      }
    }
  );
});

app.post("/admin/deleteUser", function(req, res) {
  conn.query("DELETE from user WHERE id = ?", [req.body.userID], function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully Deleted User");
    }
  });
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
