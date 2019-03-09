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

//Using for sending download urls
//TODO: change to production url
const baseUrl = "http://localhost:5000";

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

app.post("/getQueryCsv", function(req, res) {
  const directory = path.join(__dirname, "../");

  var fileName = req.body.fileName;

  const filePrefix = fileName ? fileName : "custom-report" + Date.now();
  const file = directory + "/server/public/reports/" + filePrefix + ".csv";
  var url = baseUrl + "/download-report?report=" + filePrefix;

  var target = req.body.target;
  var nameType = req.body.nameType;
  var name = req.body.name;
  var firstName = "";
  var lastName = "";
  var nameTryBoth = false;
  if (name) {
    if (name.split(" ").length > 1) {
      firstName = name.split(" ")[0];
      lastName = name.split(" ")[1];
    } else {
      // Attempt to find matching first or last name from providing single name
      firstName = lastName = name;
      nameTryBoth = true;
    }
  }
  var awardType = req.body.awardType;
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var awardComparator = req.body.awardComparator;
  var awardComparisonValue = Number(req.body.awardComparisonValue);

  var sqlQuery = "";

  //TODO: build sql query
  //build sql query from request parameters
  if (target === "awards") {
    //build awards string
    sqlQuery =
      "SELECT date, awardType.name as type, concat_ws(' ', employee.firstName, employee.lastName) as `Recipient Name`, \
      concat_ws(' ', user.firstName, user.lastName) as `Creator Name` FROM awardrecognition.awardGiven \
      JOIN awardType on awardGiven.awardTypeID=awardType.id \
      JOIN employee on awardGiven.recipientID=employee.id \
      JOIN user on awardGiven.creatorID=user.id";

    var previousWhereClause = false;
    // Add name constraints
    if (nameType && name) {
      if (nameType === "recipient") {
        if (nameTryBoth) {
          sqlQuery +=
            " WHERE (employee.firstName=" +
            conn.escape(name) +
            " OR employee.lastName=" +
            conn.escape(name) +
            ")";
        } else {
          sqlQuery +=
            " WHERE employee.firstName=" +
            conn.escape(firstName) +
            " AND employee.lastName=" +
            conn.escape(lastName);
        }
        previousWhereClause = true;
      } else if (nameType === "creator") {
        if (nameTryBoth) {
          sqlQuery +=
            " WHERE (user.firstName=" +
            conn.escape(name) +
            " OR user.lastName=" +
            conn.escape(name) +
            ")";
        } else {
          sqlQuery +=
            " WHERE user.firstName=" +
            conn.escape(firstName) +
            " AND user.lastName=" +
            conn.escape(lastName);
        }
        previousWhereClause = true;
      }
    }

    //Add award type constraints
    if (awardType) {
      if (previousWhereClause) {
        sqlQuery += " AND awardType.id=" + conn.escape(awardType);
      } else {
        sqlQuery += " WHERE awardType.id=" + conn.escape(awardType);
        previousWhereClause = true;
      }
    }

    //Add date constraints
    if (startDate) {
      if (previousWhereClause) {
        sqlQuery += " AND date >" + conn.escape(startDate);
      } else {
        sqlQuery += " WHERE date >" + conn.escape(startDate);
        previousWhereClause = true;
      }
    }
    if (endDate) {
      if (previousWhereClause) {
        sqlQuery += " AND date <" + conn.escape(endDate);
      } else {
        sqlQuery += " WHERE date <" + conn.escape(endDate);
        previousWhereClause = true;
      }
    }

    sqlQuery += " ORDER BY date DESC";
  } else if (target === "employees") {
    //build employees string
    sqlQuery +=
      "select `Number of Awards`, concat_ws(' ', firstName, lastName) as Name from \
    (select count(*) as `Number of Awards`, employee.firstName, employee.lastName from awardGiven\
    join employee on employee.id=awardGiven.recipientID";

    var previousWhereClause = false;
    // Add name constraints
    if (name) {
      if (nameTryBoth) {
        sqlQuery +=
          " WHERE (employee.firstName=" +
          conn.escape(name) +
          " OR employee.lastName=" +
          conn.escape(name) +
          ")";
      } else {
        sqlQuery +=
          " WHERE employee.firstName=" +
          conn.escape(firstName) +
          " AND employee.lastName=" +
          conn.escape(lastName);
      }
      previousWhereClause = true;
    }

    //End additions to derived table part of query, so we're working with a new set of where clauses
    sqlQuery += " group by employee.id) as t";
    previousWhereClause = false;

    //Add award constraints
    if (awardComparator && awardComparisonValue) {
      if (awardComparator === "<") {
        if (previousWhereClause) {
          sqlQuery +=
            " AND `Number of Awards`<" + conn.escape(awardComparisonValue);
        } else {
          sqlQuery +=
            " WHERE `Number of Awards`<" + conn.escape(awardComparisonValue);
        }
      } else if (awardComparator === ">") {
        if (previousWhereClause) {
          sqlQuery +=
            " AND `Number of Awards`>" + conn.escape(awardComparisonValue);
        } else {
          sqlQuery +=
            " WHERE `Number of Awards`>" + conn.escape(awardComparisonValue);
        }
      } else if (awardComparator === "=") {
        if (previousWhereClause) {
          sqlQuery +=
            " AND `Number of Awards`=" + conn.escape(awardComparisonValue);
        } else {
          sqlQuery +=
            " WHERE `Number of Awards`=" + conn.escape(awardComparisonValue);
        }
      }
      previousWhereClause = true;
    }

    sqlQuery += " ORDER BY `Number of Awards` DESC";
  }

  //call sql query, then construct csv
  conn.query(sqlQuery, function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.send("There was an error with your request");
    } else {
      // Format data as csv
      var data = "";
      fields.forEach(function(field) {
        data = data.concat(field.name + ",");
      });
      data = data.slice(0, -1).concat("\n");
      rows.forEach(function(row) {
        Object.keys(row).forEach(function(key) {
          data = data.concat(row[key] + ",");
        });
        data = data.slice(0, -1).concat("\n");
      });

      //Write file to reports folder
      filesystem.writeFile(file, data, function(err) {
        if (err) {
          console.log(err);
          res.send(err);
        } else res.json(url);
      });
    }
  });
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
          function(err, row) {
            if (err) {
              console.log(err);
              msg = "Award failed.";
              res.send(msg);
            } else {
              msg = "Award successfully granted.";

              var awardID = row.insertId;
              console.log("Award successfully granted.");
              var certificate = require(directory + '/resources/certificate.js')
              certificate(awardID);

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
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        changes.password = hash;
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
    });
  } else {
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
  }
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
  conn.query(
  "SELECT id, firstName, lastName, email FROM employee",
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting top employees from database.");
      } else {
        var data = rows.map((x) => ({ id: x.id, firstName: x.firstName, lastName: x.lastName }))
        res.json(data);
      }
    }
  );
});

app.get("/user/getemployee", function(req, res) {
  conn.query(
    "SELECT id, firstName, lastName, email FROM employee WHERE id=?",
    [req.query.id],
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting employee from database.");
      } else {
        var data = rows.map((x) => ({ id: x.id, firstName: x.firstName, lastName: x.lastName, email: x.email }))
        res.json(data);
      }
    }
  );
});

app.get("/user/account", function(req, res) {
  conn.query(
  "SELECT id, firstName, lastName, email, password FROM user WHERE id=?",
  [req.query.id],
    function(err, rows) {
      if (err) {
        console.log(err);
        res.send("Error getting employee from database.");
      } else {
        var data = rows.map((x) => ({ id: x.id, firstName: x.firstName, lastName: x.lastName, email: x.email }))
        res.json(data);
      }
    }
  );
});

app.post("/user/account", function(req, res) {
  var changes = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: ""
  };
  if (req.body.password != " ") {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
    changes.password = hash;
    //console.log("the hash passowrd " + JSON.stringify(changes))
    //changes.password = req.body.password;
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
    });
  }
  else{
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
}
});

app.post("/user/addEmployee", function(req, res) {
  conn.query(
    "INSERT INTO employee (firstName, lastName, email) VALUES (?, ?, ?)",
    [req.body.firstName, req.body.lastName, req.body.email],
    function(err) {
      if (err) {
        console.log(err);
        res.send(err);
      } 
      else {
        conn.query(
          "SELECT id FROM employee WHERE firstName=? AND lastName=? AND email=?",
          [req.body.firstName, req.body.lastName, req.body.email],
            function(err, rows) {
              if (err) {
                console.log(err);
                res.send("Error getting employee from database.");
              } else {
                var data = rows[0].id;
                res.json(data);
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
  var url = baseUrl + "/download-report?report=" + report;

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
