/************************************************
** Certificate Generator
************************************************/

// Path for Directory
const path = require('path');
const directory = path.join(__dirname, '../');
const fs = require('fs');
const replace = require('replace-in-file')

// Node Add-on
const latex = require(directory + 'node_modules/node-latex');

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

    console.log("Getting SQL Query information");
    
    var sql = "SELECT awardGiven.id, awardGiven.creatorID, awardGiven.date, e.id, e.firstName, e.lastName, e.email, e.signature FROM awardGiven LEFT JOIN user AS e ON awardGiven.creatorID = e.id WHERE awardGiven.id = ?";
    
    console.log("Connecting to DB to get query");
    
    conn.query(sql, awardID, function(error, results) {
        if (error)
            throw error;
            
        console.log("Getting creator information from DB");
        var row = JSON.parse(JSON.stringify(results[0]));

        awardInformation.creatorFirstName = row.firstName;
        awardInformation.creatorLastName = row.lastName;
        awardInformation.creatorSignature = row.signature;
        awardInformation.awardDate = row.date;
        
        recipientInfo(conn, awardInformation, awardID);
    });
}

/************************************************
** Award Recipient
************************************************/
function recipientInfo(conn, awardInformation, awardID) {
    var sql = "SELECT awardGiven.id, awardGiven.recipientID, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.recipientID = e.id WHERE awardGiven.id = ?"; 
    
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
    var sql = "SELECT awardGiven.id, awardGiven.awardTypeID, awardGiven.recipientID, type.name, type.description FROM awardGiven LEFT JOIN awardType AS type ON awardGiven.awardTypeID = type.id WHERE awardGiven.id = ?";
    
    conn.query(sql, awardID, function(error, results) {
        if (error)
            throw error;
        
        var row = JSON.parse(JSON.stringify(results[0]));

        awardInformation.awardType = row.name;
        awardInformation.awardDescription = row.description;
        
        createLatex(awardInformation, awardID);
    });
}

function writeVar(file, placeholder, text) {
    const options = {
        files: file,
        from: placeholder,
        to: text,
    };
    try {
        const changes = replace.sync(options);
        console.log('Modified files:', changes.join(', '));
      }
      catch (error) {
        console.error('Error occurred:', error);
      }
}

/************************************************
** Create LaTex file
************************************************/
function createLatex(awardInformation, awardID) {
    var f = directory + directory + 'resources/awards/' + awardID + '.tex';
    fs.writeFileSync(f, '')

    var original = directory + 'resources/certification.tex'
    
    fs.copyFile(original, f, (err) => {
        if (err) throw err;
    });
    
    writeVar(f, "senderFirstName", awardInformation.creatorFirstName)
    writeVar(f, "senderLastName", awardInformation.creatorLastName)
    writeVar(f, "recipientFirstName", awardInformation.recipientFirstName)
    writeVar(f, "recipientLastName", awardInformation.recipientLastName)
    writeVar(f, "awardName", awardInformation.awardType)
    writeVar(f, "awardDate", awardInformation.awardDate)
    
    tempPath = directory.replace(/\\/g, '/')
    writeVar(f, "workingDirectory", tempPath + 'resources/signatures/')
    writeVar(f, "senderSignature", awardInformation.creatorSignature)

    convertToPDF(fs, awardInformation, awardID)
}

/************************************************
** Convert LaTex to PDF
** https://github.com/saadq/node-latex
************************************************/
function convertToPDF(filesystem, awardInformation, awardID) {
    console.log("Converting to PDF");
    
    const input = filesystem.createReadStream(directory + 'resources/awards/' + awardID + '.tex');
    const output = filesystem.createWriteStream(directory + 'resources/awards/' + awardID + '.pdf');
    
    console.log("Latex input\n");
    const pdf = latex(input);
    
    pdf.pipe(output)
    pdf.on('error', err=> console.log(err))
    
    pdf.on('finish', function(error) {
        console.log("PDF Finished");
        fs.unlink(directory + 'resources/awards/' + awardID + '.tex', function (err) {
            if (err) throw err;
            console.log('temptex deleted!');
        });
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
