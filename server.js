const express = require('express');
const app = express();
var port = 5000;

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
app.get('/employees', function(req, res){
    //hard coded data, replace with DB query
    const employees = [
        {id: 1, name: 'aaron'},
        {id: 2, name: 'bob'},
        {id: 3, name: 'carter'}
    ];
    res.json(employees);
});

app.listen(port, function(){
    console.log(`server started on ${port}`);
});
