/************************************************
** Email
************************************************/

// Path for Directory
const path = require('path');
const directory = path.join(__dirname, '../');


// Node Add-on
const nodemailer = require(directory + 'node_modules/nodemailer');

// Variables
var emailInformation = {};

module.exports = sendEmail;

function sendEmail(awardID){
    
    console.log("Inside Email");
        
    const mysql = require("mysql");    
    const config = require(directory + 'server/config.js');
    var conn = mysql.createConnection(config);
        
    emailInformation.awardID = awardID;

    var sql = "SELECT awardGiven.id, awardGiven.recipientID, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.recipientID = e.id WHERE awardGiven.id = ?";
    
    conn.query(sql, awardID, function(error, results) {
        if (error)
            throw error;

        var row = JSON.parse(JSON.stringify(results[0]));
        emailInformation.recipientFirstName = row.firstName;
        emailInformation.recipientLastName = row.lastName;
        emailInformation.recipientEmail = row.email;

        sql = "SELECT awardGiven.id, awardGiven.creatorID, awardGiven.date, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.creatorID = e.id WHERE awardGiven.id = ?";

        conn.query(sql, awardID, function(error, results) {
            if(error) 
                throw error;
            
            var row = JSON.parse(JSON.stringify(results[0]));
            emailInformation.creatorFirstName = row.firstName;
            emailInformation.creatorLastName = row.lastName;

            createTransporter(emailInformation, awardID);
        });
    });
}
    
    
/*
* Create Transporter
*/
function createTransporter(emailInformation, awardID) {
    var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        host: 'stmp.gmail.com',
        auth: {
            user: 'donotreplyzibalgroup@gmail.com',
            pass: 'zibalgroup19'
        }
    });

    var company = 'donotreplyzibalgroup@gmail.com';

    var message = {
        from: company,
        to: emailInformation.recipientEmail,
        subject: "You have been recognized!",
        html: '<p>Dear ' + emailInformation.recipientFirstName + ',<p>' +
            '<p>Congratulations, you have been recognized!</p>',
        attachments: {
            filename: awardID + '.pdf',
            path: directory + 'resources/awards/' + awardID + '.pdf'
        }
    }

    smtpTransport.sendMail(message, function(error, info) {
        if (error)
            throw error;

        console.log("Email sent");
    })
}


