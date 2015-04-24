var express = require('express');
var router = express.Router();
var stackModel = require('../model/stack');
var tableModel = require('../model/game');
var Q = require("q");
var MongoClient = require("mongodb").MongoClient;
var databaseUrl = "mongodb://localhost:27017/blackjack";

//Connect to database and get collection

function getdb(collName) {
    var deferred = Q.defer();
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            console.log("Problem connecting database");
            deferred.reject(new Error(err));
        } else {


            var collection = db.collection(collName, {
                capped: true,
                size: 100000
            });
            deferred.resolve(collection);
        }
    });
    return deferred.promise;
}

function generateTableName() {
    var temp = Date.now();
    return (temp.toString(36));

}

/* GET home page. */
router.get('/', function(req, res, next) {
    createNewTable().then(function(table){
        console.log(table) ;
        res.end("check console");
    });


});

function createNewTable(){
    var deferred = Q.defer();
    var stack = new stackModel.Stack();
    stack.makeDeck(2);
    stack.shuffle(5);
    var table = {
        tableName: generateTableName(),
        players:[],
        dealer : null,
        stack: stack
    };
    getdb("table").then(function(collection) {

        collection.insert(table,function(err,result){
            if(err){
                console.log(err);
                deferred.reject(new Error(err));
            } else{
                // console.log(result);
                deferred.resolve(result.ops[0]);

            }
        });

    }).fail(function(err){
        deferred.reject(new Error(err));
    });
    return deferred.promise;

}
function getAllTable(){

}

function getPlayer(playerId){

}

function findTableForMe(player){

}

module.exports = router;
