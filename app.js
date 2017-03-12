var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var parseUrlEncoded = bodyParser.json();
var app = express();
var router = express.Router();
var monk = require('monk');
var http = require('http');
var request = require('request');

/** db  ****/
const db = monk('localhost:27017/photoApp');
const albumsCollection = db.get('albums');
const photosCollection = db.get('photos');

/***Routes **/
var albumsRouteHandler = require('./routes/albums');
app.use('/albums', albumsRouteHandler);

var photosRouteHandler = require('./routes/photos');
app.use('/photos', photosRouteHandler);

/** load static files **/
app.use(express.static('public'));

// Initialize the Application
app.get('/init', function(req,res) {

	console.log('DB connected....');

	// call albums service
	request.get('https://jsonplaceholder.typicode.com/albums', function(req, res) {
		var data = JSON.parse(res.body);

		// insert data from albums service
		albumsCollection.insert(data, function(err, docs) {
			if(err) console.log(err);
		});
	});

	//photos service
	request.get('https://jsonplaceholder.typicode.com/photos', function(req, res) {		
		var data = JSON.parse(res.body);

		// insert data from photos service
		photosCollection.insert(data, function(err, docs) {
			if(err) console.log(err);
		});
	});

	console.log('Initialization completed...');
	res.send();
}); 

// Load the home page and call initialize method 
app.get('/', function (req, res) {
	
	var userId = 1;
	console.log('Initialization started...');
	request.get('http://localhost:3000/init', function(req1,resp1) {
		
		request.get('http://localhost:3000/albums/user/' + userId, function(req2, resp2) {
			var result = JSON.parse(resp2.body);
			res.sendFile('index.html', {root: __dirname + '/views'});
		});
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


module.exports = app;
