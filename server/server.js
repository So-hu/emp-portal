const express = require("express");
const app = express();
var port = 5000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//server connection placeholder
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
    "select lastName, firstName, email, userClass, accountCreated, userId from user ORDER BY lastName",
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
});

app.get("/allAwards", function(req, res) {
  conn.query(
    "select awardTypeID, month, date, year, firstName, creatorID from awardGiven ORDER BY firstName",
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
});

//example server side route function for data fetching
app.get("/awardsData", function(req, res) {
  conn.query(
    "select month, date, year, firstName from awardGiven ORDER BY month",
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
        conn.query(
          "INSERT INTO user (userClass, firstName, lastName, email, password, accountCreated) VALUES(?,?,?,?,?,?)",
          [
            req.body.userClass,
            req.body.firstName,
            req.body.lastName,
            req.body.user,
            req.body.password,
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
      }
    }
  );
});

app.post("/user/addAward", function(req, res) {
  var msg = "";
      console.log(req.body);
        conn.query(
          "INSERT INTO awardGiven (month, date, year, time, firstName) VALUES(?,?,?,?,?)",
          [
            req.body.month,
            req.body.date,
            req.body.year,
            req.body.time,
            req.body.firstName
          ],
          function(err) {
            if (err) {
              msg = "Email Already in Use";
              console.log(err);
              res.send(msg);
            } else {
              msg = "Successfully Added User";
              console.log(err);
              res.send(msg);
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
    "UPDATE user SET ?  WHERE userID = ?",
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
  conn.query("DELETE from user WHERE userID = ?", [req.body.userID], function(
    err
  ) {
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
