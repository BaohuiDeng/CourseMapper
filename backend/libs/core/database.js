/* jslint node:true */

/**
 * connecting to database, and returns a mongoose instance
 */

var mongoose = require('mongoose');
var config = require('config');

function database() {
    this.connectionOptions = process.env.DATABASE || 'mongodb://localhost:27017/course_mapper';
}

// var options = {
//   useMongoClient: true,
//   socketTimeoutMS: 0,
//   keepAlive: true,
//   reconnectTries: 30
// };

database.prototype.connect = function () {
    return mongoose.connect(this.connectionOptions, {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true});
};

var DB = new database();
var db = DB.connect();

mongoose.connection.on('error', function dbConnectionFailed(err) {
	
    console.log('Database error: %s', err);
}).once('open', function dbConnectionOpened() {
    // console.log('Database connected to "%s".', process.env.DATABASE);
});

module.exports = db;
