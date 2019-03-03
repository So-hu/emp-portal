/************************************************
** Certificate Generator
************************************************/

// Path for Directory
const path = require('path');
const directory = path.join(__dirname, '../');

// Node Add-on
const latex = require(directory + 'node_modules/node-latex')

// Connect to Database
//const conn = require(directory + 'server/config.js')

// Varibles
var awardInformation = {};

module.exports = creatorInformation;

/************************************************
** Award Creator
************************************************/
function creatorInformation(awardID) {

    const mysql = require("mysql");    
    const config = require(directory + 'server/config.js');
    var conn = mysql.createConnection(config);
    
    awardInformation.awardID = awardID;

    console.log("Getting SQL Query information\n");
    
    var sql = "SELECT awardGiven.id, awardGiven.creatorID, awardGiven.date, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.creatorID = e.id WHERE awardGiven.id = ?";
    
    console.log("Connecting to DB to get query\n");
    
    conn.query(sql, awardID, function(error, results) {
        if (error)
            throw error;
            
        console.log("Getting creator information from DB");
        var row = JSON.parse(JSON.stringify(results[0]));

        awardInformation.creatorFirstName = row.firstName;
        awardInformation.creatorLastName = row.lastName;
//        awardInformation.creatorSignature = row.signature;
        awardInformation.awardDate = row.date;
        
        recipientInfo(conn, awardInformation, awardID);
    });
}

/************************************************
** Award Recipient
************************************************/
function recipientInfo(conn, awardInformation, awardID) {
    var sql = "SELECT awardGiven.id, awardGiven.recipientID, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.recipientID = e.id WHERE awardGiven.id = ?" 
    
    conn.query(sql, awardID, function(error, results) {
        if (error)
            throw error;

        var row = JSON.parse(JSON.stringify(results[0]));

        awardInformation.recipientFirstName = row.firstName;
        awardInformation.recipientLastName = row.lastName;
        awardInformation.recipientEmail = row.email;
        
        awardTypeInfo(conn, awardInformation, awardID);
    });
}

/************************************************
** Award Type
************************************************/
function awardTypeInfo(conn, awardInformation, awardID) {
    var sql = "SELECT awardGiven.id, awardGiven.awardTypeID, awardGiven.recipientID, type.name, type.description FROM awardGiven LEFT JOIN awardType AS type ON awardGiven.awardTypeID = type.id WHERE awardGiven.id = ?" 
    
    conn.query(sql, awardID, function(error, results) {
        if (error)
            throw error;
        
        var row = JSON.parse(JSON.stringify(results[0]));

        awardInformation.awardType = row.name;
        awardInformation.awardDescription = row.description;
        
        createCSV(awardInformation, awardID);
    });
}

/************************************************
** Create CSV for LaTex
************************************************/
function createCSV(awardInformation, awardID) {
    const filesystem = require('fs');
    var file = directory + 'resources/data.csv'
    
    
    var rows = "senderFirstName,senderLastName,recipientFirstName,recipientLastName,recipientEmail,awardType,awardDate\n"
    
    // First row - head
//    var row = "senderFirstName,senderLastName,recipientFirstName,recipientLastName,recipientEmail,awardType,senderSignature,awardDate\n"
    
    rows += awardInformation.creatorFirstName + "," + awardInformation.creatorLastName + "," + awardInformation.recipientFirstName + "," + awardInformation.recipientLastName + "," + awardInformation.recipientEmail + "," + awardInformation.awardType + "," + awardInformation.awardDate;
    
    // Insert award info
//    rows += awardInformation.creatorFirstName + "," + awardInformation.creatorLastName + "," + awardInformation.recipientFirstName + "," + awardInformation.recipientLastName + "," + awardInformation.recipientEmail + "," + awardInformation.awardType + "," + awardInformation.creatorSignature + "," + awardInformation.awardDate;
    
    // Write to CSV file
    filesystem.writeFile(file, rows, function(error) {
        if (error)
            throw error;
        
        // Convert to PDF
        convertToPDF(filesystem, awardInformation, awardID);
    })
}


/************************************************
** Convert LaTex to PDF
** https://github.com/saadq/node-latex
************************************************/
function convertToPDF(filesystem, awardInformation, awardID) {
    console.log("Converting to PDF\n")
    const input = filesystem.createReadStream(directory + 'resources/certification.tex')
//    const output = filesystem.createWriteStream(directory + 'resources/awards/' + awardID + '.pdf');
    
    console.log("Latex input\n");
    const pdf = latex(input);
    
    
    console.log(directory + 'resources/\n');
    pdf.pipe(filesystem.createWriteStream(directory + 'resources/awards/' + awardID + '.pdf'));
    
    pdf.on('error', function(error) {
        if (error)
            console.log("PDF On Error\n");
            throw error;
    })
    
    pdf.on('finish', function(error) {
        console.log("PDF Finished\n");
        sendEmail(awardID);
    })
}


/************************************************
** Send certificate by email
************************************************/
function sendEmail(awardID) {
    const email = require('./email.js')
    email(awardID);
} 

