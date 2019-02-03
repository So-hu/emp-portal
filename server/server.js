const express = require('express');
const app = express();
var port = 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

/*
//server connection placeholder
const mysql = require('mysql');
const conn = mysql.createconnection({
    host: 'hostname',
    user: 'username',
    password: 'password',
    database: 'database'
});

connection.connect(err, function{
    if(err) {
        return err;
    }
});
*/
app.get('/', function(req, res){
    res.send('this is the express backend homepage');
});

//example server side route function for data fetching
app.get('/employeeData', function(req, res){
    //hard coded data, replace with DB query
    const employees = [
        {id: 1, name: 'aaron'},
        {id: 2, name: 'bob'},
        {id: 3, name: 'carter'}
    ];
    res.json(employees);
});

//this function will need to return whether the login is valid as well as the userclass.
app.post('/userAuth', function(req, res){
    const {user, password} = req.body;
    var result = {valid: false, role:'', msg:''}
    if((user === 'admin') && (password === '123')){
        result.valid = true
        result.role = 'administrator'
    }
    else if((user === 'joe') && (password === 'schmoe')){
        result.valid = true
        result.role = 'user'
    }
    else{
        result.msg = 'Username and password do not match'
    }
    res.json(result);
});

app.listen(port, function(){
    console.log(`server started on ${port}`);
});
