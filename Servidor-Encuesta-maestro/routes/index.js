var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();

var db;
const dbFilePath = './db/UserSurvey.db';

//Initialize database connection
function initialize(){
    this.db = new sqlite.Database(dbFilePath, function(err) {
        if(err){
            console.error('Error connecting to the database');
        }
        else{
            console.log('connected to the database');
        }
    });

}

//Authorize login for admin
router.post('/authorizeLogin', function(req, res) {
    if(req.body.userName === "admin" && req.body.password === "password"){
        res.sendStatus(200);
    }
    else{
        res.sendStatus(500);
    }
});

//Get admin portal data from database
router.get('/getAdminData', function(req, res){
    var sendData = {};
    getTotalSurvey(res, sendData, function(err, res, sendData){
        if(err){
            res.sendStatus(500);
        }
        else{
            res.send({response: sendData});
        }
    });
});

//Find average age and total survey count
function getTotalSurvey(res, sendData, callBack){

    this.db.get('SELECT COUNT(*) as surveyCount, AVG(Age) as averageAge FROM UserSurvey', function(err, row){
        if (err) {
            console.error(err.message);
            callBack(err, res, sendData);
        }
        else{
            sendData.surveyCount = row.surveyCount;
            sendData.averageAge = row.averageAge;
            getMostPopularArtist(res, sendData, callBack);
        }
    });
}

//Now find most popular artist
function getMostPopularArtist(res, sendData, callBack){

    this.db.get('SELECT Artist as mostPopularArtist, MAX(count) as maxCount FROM (' +
        'select Artist, Count(Artist) as count FROM UserSurvey GROUP BY Artist) as Temp', function(err, row) {
        if (err) {
            console.error(err.message);
            callBack(err, res, sendData);
        }
        else {
            sendData.mostPopularArtist = row.mostPopularArtist;
            getLeastPopularArtist(res, sendData, callBack);
        }
    });
}

//Now find least popular artist
function getLeastPopularArtist(res, sendData, callBack){

    this.db.get('SELECT Artist as leastPopularArtist, MIN(count) as minCount FROM (' +
        'select Artist, Count(Artist) as count FROM UserSurvey GROUP BY Artist) as Temp', function(err, row) {
        if (err) {
            console.error(err.message);
            callBack(err, res, sendData);
        }
        else {
            sendData.leastPopularArtist = row.leastPopularArtist;
            getMostFrequentRegion(res, sendData, callBack);
        }
    });
}

//Now find most frequent region
function getMostFrequentRegion(res, sendData, callBack){

    this.db.get('SELECT Region as frequentRegion, MAX(count) as maxCount FROM (' +
        'select Region, Count(Region) as count FROM UserSurvey GROUP BY Region) as Temp', function(err, row) {
        if (err) {
            console.error(err.message);
            callBack(err);
        }
        else {
            sendData.frequentRegion = row.frequentRegion;
            callBack(null, res, sendData);
        }
    });
}

//Insert new survey submission data into database
router.post('/sendSurveyData', function(req, res){

    this.db.run('INSERT INTO UserSurvey(FirstName, LastName, Age, Region, Artist) VALUES(?, ?, ?, ?, ?)',
        [req.body.firstName, req.body.lastName, req.body.age, req.body.region, req.body.artist], function(err) {
            if (err) {
                console.error(err.message);
                res.sendStatus(500);
            }
            else{
                // get the last insert id
                console.log('A row has been inserted with rowid ' + this.lastID);
                res.sendStatus(200);
            }
        });
});


// close the database connection
function close(){

    this.db.close(function(err){
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

initialize();


module.exports = router;
