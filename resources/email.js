/************************************************
** Email
************************************************/

// Path for Directory
const path = require('path');
const directory = path.join(__dirname, '../');


// Node Add-on
const nodemailer = require(directory + 'node_modules/nodemailer');

// Connect to Database

// Variables
var emailInformation = {}

function email(awardID){
    
    console.log('Inside Email JS\n');
    console.log('Award ID number is: ' + awardID);
//    console.log(awardInformation + '\n');
    
    /********************************************
    ** Get data from DB
    ********************************************/
//    function dbInfo() {
    
        const mysql = require("mysql");    
        const config = require(directory + 'server/config.js');
        var conn = mysql.createConnection(config);
        
        var sql = "SELECT awardGiven.id, awardGiven.recipientID, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.recipientID = e.id WHERE awardGiven.id = ?"

        conn.query(sql, awardID, function(error, results) {
            if (error)
                throw error;

            var row = JSON.parse(JSON.stringify(results[0]));
            emailInformation.recipientName = row.recipientFirstName + " " + row.recipientLastName;
//            emailInformation.recipientLastName = row.recipientLastName;
            emailInformation.recipientEmail = row.recipientEmail;
            
            sql = "SELECT awardGiven.id, awardGiven.creatorID, awardGiven.date, e.id, e.firstName, e.lastName, e.email FROM awardGiven LEFT JOIN employee AS e ON awardGiven.creatorID = e.id WHERE awardGiven.id = ?"
            
            conn.query(sql, awardID, function(error, results) {
                if(error) 
                    throw error;

                var row = JSON.parse(JSON.stringify(results[0]));
                emailInformation.creatorFirstName = row.firstName;
                emailInformation.creatorLastName = row.lastName;
//                
//                createTransporter(emailInformation);
            });
        });
//    });
    
    
    /*
    * Create Transporter
    */
//    function createTransporter(awardInformation, awardID) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            host: 'stmp.gmail.com',
            auth: {
                user: '',
                pass: ''
            }
        });
    
        var company = 'donotreplyzibalgroup@gmail.com';
        
        var message = {
            to: emailInformation.recipientEmail,
//            to: awardInformation.recipientEmail,
            from: company,
            subject: "You have been recognized!",
            html: '<p>Dear ' + emailInformation.recipientFirstName + ',<p>' +
                '<p>Congratulations, you have been recognized!</p>',
            attachments: {
                filename: 'award' + awardID + '.pdf',
                path: directory + '/resources/awards/'
            }
        }
        
        console.log("Sending Email");
        
        smtpTransport.sendMail(message, function(error, info) {
            if (error)
                throw error;
                
            console.log("Email sent");
        })
    
        console.log("Exiting Email")
}

module.exports = email;