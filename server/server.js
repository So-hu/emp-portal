const express = require("express");
const app = express();
var port = 5000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var bcrypt = require("bcryptjs");
var path = require("path");

const filesystem = require("fs");

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
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
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
        });
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

// Sample report option for top 5 award recipients
app.get("/report/topRecipients", function(req, res) {
  conn.query(
    "SELECT Count(*) AS Count, \
  CONCAT_WS(' ', firstName, lastName) AS Name\
  FROM awardGiven\
  INNER JOIN employee ON employee.id=awardGiven.recipientID\
  GROUP BY employee.id\
  ORDER BY Count DESC\
  LIMIT 5",
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting top recipients");
      } else {
        data = {
          chartTitle: "Top 5 Award Winners",
          chartHTitle: "Number of awards",
          chartData: [["Name", "Number of awards"]],
          jsonData: { header: ["Name", "Number of awards"], rows: [] }
        };
        rows.forEach(function(e) {
          data.chartData.push([e.Name, e.Count]);
          data.jsonData["rows"].push([e.Name, e.Count]);
        });
        console.log(data);
        res.json(data);
      }
    }
  );
});

app.get("/report/topGivers", function(req, res) {
  conn.query(
    "SELECT Count(*) AS Count, \
  CONCAT_WS(' ', firstName, lastName) AS Name\
  FROM awardGiven\
  INNER JOIN user ON user.id=awardGiven.creatorID\
  GROUP BY user.id\
  ORDER BY Count DESC\
  LIMIT 5",
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting top recipients");
      } else {
        data = {
          chartTitle: "Top 5 Award Givers",
          chartHTitle: "Number of awards",
          chartData: [["Name", "Number of awards"]],
          jsonData: { header: ["Name", "Number of awards"], rows: [] }
        };
        rows.forEach(function(e) {
          data.chartData.push([e.Name, e.Count]);
          data.jsonData["rows"].push([e.Name, e.Count]);
        });
        res.json(data);
      }
    }
  );
});

app.get("/report/awardsByMonth", function(req, res) {
  conn.query(
    'SELECT MONTHNAME(awardGiven.date) as Month, COUNT(*) as Awards\
    FROM awardrecognition.awardGiven\
    WHERE YEAR(awardGiven.date) = "2018"\
    GROUP BY MONTH(awardGiven.date)',
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting awardsByMonth");
      } else {
        data = {
          chartTitle: "Awards by Month",
          chartHTitle: "Month",
          chartData: [["Month", "Number of awards"]],
          jsonData: { header: ["Month", "Number of awards"], rows: [] }
        };
        rows.forEach(function(e) {
          data.chartData.push([e.Month, e.Awards]);
          data.jsonData["rows"].push([e.Month, e.Awards]);
        });
        res.json(data);
      }
    }
  );
});

app.get("/report/awardsByYear", function(req, res) {
  conn.query(
    "SELECT YEAR(awardGiven.date) as Year, COUNT(*) as Awards\
    FROM awardrecognition.awardGiven\
    GROUP BY YEAR(awardGiven.date)",
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting awardsByYear");
      } else {
        data = {
          chartTitle: "Awards by Year",
          chartHTitle: "Year",
          chartData: [["Year", "Number of awards"]],
          jsonData: { header: ["Year", "Number of awards"], rows: [] }
        };
        rows.forEach(function(e) {
          data.chartData.push([e.Year.toString(), e.Awards]);
          data.jsonData["rows"].push([e.Year.toString(), e.Awards]);
        });

        res.json(data);
      }
    }
  );
});

app.get("/user/awardsgiven", function(req, res) {
  //res.json({"total":100});
  var eom = 0; //employee of the month counter
  var eow = 0; //employee of the week counter
  var hsm = 0; //highest sale of the month
  var unknown = 0;

  conn.query("SELECT awardTypeID FROM awardGiven", function(err, data) {
    if (err) {
      console.log(err);
      res.send("Error getting awardGiven");
    } else {
      for (var i = 0; i < data.length; i++) {
        if (data[i].awardTypeID === 1) {
          eom++;
        } else if (data[i].awardTypeID === 2) {
          eow++;
        } else if (data[i].awardTypeID === 3) {
          hsm++;
        } else {
          unknown++;
        }
      }
      res.send({ eom, eow, hsm, unknown });
    }
  });
});

app.get("/user/top5employess", function(req, res) {
  conn.query(
    "SELECT Count(*) AS Count, \
      CONCAT_WS(' ', firstName, lastName) AS Name\
      FROM awardGiven\
      INNER JOIN employee ON awardGiven.recipientID=employee.id\
      GROUP BY employee.id\
      ORDER BY Count DESC\
      LIMIT 5",
    function(err, data) {
      if (err) {
        console.log(err);
        res.send("Error getting awardGiven");
      } else {
        data = {
          employee1: data[0].Name,
          emp1Awards: data[0].Count,
          employee2: data[1].Name,
          emp2Awards: data[1].Count,
          employee3: data[2].Name,
          emp3Awards: data[2].Count,
          employee4: data[3].Name,
          emp4Awards: data[3].Count,
          employee5: data[4].Name,
          emp5Awards: data[4].Count
        };
        res.send(data);
      }
    }
  );
});

//Get awards history
app.get("/user/awardsData", function(req, res) {
  conn.query(
    "SELECT date, awardType.name as type,  employee.firstName as recipientFirst, \
    employee.lastName as recipientLast \
    FROM awardrecognition.awardGiven \
    JOIN awardType on awardGiven.awardTypeID=awardType.id \
    JOIN employee on awardGiven.recipientID=employee.id \
    ORDER BY date DESC \
    LIMIT 5;",
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
app.get("/user/summary", function(req, res) {
  var data;
  var numEmps;
  var awardsGiven;
  conn.query("SELECT Count(*) AS Count FROM employee", function(err, result) {
    if (err) {
      console.log(err);
    } else {
      numEmps = result[0].Count;

      conn.query("SELECT Count(*) AS Count2 FROM awardGiven", function(
        err,
        result2
      ) {
        if (err) {
          console.log(err);
        } else {
          awardsGiven = result2[0].Count2;

          data = {
            numEmployees: numEmps,
            numberAwards: awardsGiven
          };
          res.json(data);
        }
      });
    }
  });
});

app.get("/user/employeesonsystem", function(req, res) {
  conn.query("SELECT id, firstName, lastName, email FROM employee", function(
    err,
    rows
  ) {
    if (err) {
      console.log(err);
      res.send("Error getting top employees from database.");
    } else {
      console.log("Server 1: " + rows[0].firstName);
      var data = rows.map(x => ({
        id: x.id,
        firstName: x.firstName,
        lastName: x.lastName
      }));
      //console.log("Server: " + data[0].firstName + " " + data[0].id);
      res.json(data);
    }
  });
});

app.get("/user/getemployee", function(req, res) {
  console.log("this id as sent: " + req.query.id);
  conn.query(
    "SELECT id, firstName, lastName, email FROM employee WHERE id=?",
    [req.query.id],
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting employee from database.");
      } else {
        console.log("Server 1100: " + rows[0].firstName);
        var data = rows.map(x => ({
          id: x.id,
          firstName: x.firstName,
          lastName: x.lastName,
          email: x.email
        }));
        //console.log("Server: " + data[0].firstName + " " + data[0].id);
        res.json(data);
      }
    }
  );
});

//this function will need to return whether the login is valid as well as the userclass.
app.post("/userAuth", function(req, res) {
  const { user, password } = req.body;
  /*if(user == "admin"){
    res.json({valid: true, role: "administrator", msg:""})
  }*/
  var result = { valid: false, role: "", msg: "" };
  conn.query(
    "SELECT password, userClass from user WHERE email= ?",
    [user],
    function(err, data) {
      if (data.length == 0) {
        result.msg = "Username and password do not match";
        res.json(result);
      } else {
        bcrypt.compare(password, data[0].password, function(err, isMatch) {
          if (isMatch) {
            result.valid = true;
            result.role = data[0].userClass;
          } else {
            result.msg = "Username and password do not match";
          }
          res.json(result);
        });
      }
    }
  );
});

//Front end calls this function to construct the .csv, and send a download url
app.get("/getDownloadUrl", function(req, res) {
  const directory = path.join(__dirname, "../");

  var report = req.query.report;
  const file = directory + "/server/public/reports/" + report + ".csv";
  var url = "http://localhost:5000/download-report?report=" + report;

  var sqlStatment = "";
  switch (report) {
    case "topRecipients":
      conn.query(
        "SELECT Count(*) AS Count, \
      CONCAT_WS(' ', firstName, lastName) AS Name\
      FROM awardGiven\
      INNER JOIN employee ON employee.id=awardGiven.recipientID\
      GROUP BY employee.id\
      ORDER BY Count DESC\
      LIMIT 5",
        function(err, rows) {
          if (err) {
            console.log(err);
          } else {
            var data = "Name,Number of awards\n";
            rows.forEach(function(row) {
              data = data.concat(row.Name + "," + row.Count + "\n");
            });
            filesystem.writeFile(file, data, function(err) {
              if (err) {
                console.log(err);
                res.send(err);
              } else res.json(url);
            });
          }
        }
      );
      break;
    case "topGivers":
      conn.query(
        "SELECT Count(*) AS Count, \
      CONCAT_WS(' ', firstName, lastName) AS Name\
      FROM awardGiven\
      INNER JOIN user ON user.id=awardGiven.creatorID\
      GROUP BY user.id\
      ORDER BY Count DESC\
      LIMIT 5",
        function(err, rows) {
          if (err) {
            console.log(err);
          } else {
            var data = "Name,Number of awards\n";
            rows.forEach(function(row) {
              data = data.concat(row.Name + "," + row.Count + "\n");
            });
            filesystem.writeFile(file, data, function(err) {
              if (err) {
                console.log(err);
                res.send(err);
              } else res.json(url);
            });
          }
        }
      );
      break;
    case "awardsByMonth":
      conn.query(
        'SELECT MONTHNAME(awardGiven.date) as Month, COUNT(*) as Awards\
      FROM awardrecognition.awardGiven\
      WHERE YEAR(awardGiven.date) = "2018"\
      GROUP BY MONTH(awardGiven.date)',
        function(err, rows) {
          if (err) {
            console.log(err);
          } else {
            var data = "Month,Number of awards\n";
            rows.forEach(function(row) {
              data = data.concat(row.Month + "," + row.Awards + "\n");
            });
            filesystem.writeFile(file, data, function(err) {
              if (err) {
                console.log(err);
                res.send(err);
              } else res.json(url);
            });
          }
        }
      );
      break;
    case "awardsByYear":
      conn.query(
        "SELECT YEAR(awardGiven.date) as Year, COUNT(*) as Awards\
      FROM awardrecognition.awardGiven\
      GROUP BY YEAR(awardGiven.date)",
        function(err, rows) {
          if (err) {
            console.log(err);
          } else {
            var data = "Year,Number of awards\n";
            rows.forEach(function(row) {
              data = data.concat(row.Year.toString() + "," + row.Awards + "\n");
            });
            filesystem.writeFile(file, data, function(err) {
              if (err) {
                console.log(err);
                res.send(err);
              } else res.json(url);
            });
          }
        }
      );
      break;
    default:
      res.status(404).send("Report not found!");
  }
});

//Once the frontend has called the first download GET to ensure the file exists, this can be called to download the file
app.get("/download-report", function(req, res) {
  var report = req.query.report;

  res.download(
    path.resolve("server/public/reports/" + report + ".csv"),
    function(err) {
      if (err) {
        console.log(err.message);
        res.status(404).send("Sorry, report not found.");
      }
    }
  );
});

app.listen(port, function() {
  console.log(`server started on ${port}`);
});
