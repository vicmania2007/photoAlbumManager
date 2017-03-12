var express = require('express');
var router = express.Router();
var monk = require('monk');
var bodyParser = require('body-parser');
var parseUrlEncoded = bodyParser.json();
var request = require('request');

// DB 
const db = monk('localhost:27017/photoApp');
const albumsCollection = db.get('albums');


/**
	Service: Get all the albums specific to user.
	Requires: userId
	Result: array of album ojects
**/
router.route('/user/:userId')
.get(parseUrlEncoded, function(req, res) {
	var userId = parseInt(req.params.userId);
	//get user albums
	albumsCollection.find({userId: userId}, {limit:10}, function(err, docs){
		if(err) console.log(err);
		result = docs;
		res.json(result);
	});
});

/**
	Service: Fetch all photos specific to particular album.
	Requires: albumId
	Result: array of photo ojects
**/
router.route('/:albumId')
	.get(parseUrlEncoded, function(req, res) {
		//  make a call to photos service to get all the photos
		var albumId = req.params.albumId;
		request.get('http://localhost:3000/photos/album/' + albumId, function(request, response) {
			var result = JSON.parse(response.body);
			res.json(result);
		});
	});

/**
	Service: Remove an album
	Requires: id or the album
	Result: null
**/
router.route('/remove')
.post(parseUrlEncoded, function(req, res) {
	var albumId = req.body.id; //Get the id of the album we want to remove.

	request.get('http://localhost:3000/photos/album/' + albumId, function(request, response) {
		var result = JSON.parse(response.body);
		var len = result.length;
		if(len === 0) {
			albumsCollection.remove({_id: albumId}, function(err, docs) {
			if(err) console.log(err);
			res.status(202).send('Record removed successfully.');
			});
		} else {
			res.status(304).send('Album is not empty');
		}
	});
});

/**
	Service: Add a new album to existing user..
	Requires: new album object (Sent from front end)
	Result: null
**/
router.route('/new')
.put(parseUrlEncoded, function(req, res) {
	var newAlbum = req.body;
	albumsCollection.insert(newAlbum, function(err, docs) {
		if(err) console.log(err);
		res.status(202).send('Record inserted successfully.');
	});
});

/**
	Service: Edit an album(title)
	Requires: id of the album, userId.
	Result: field to be updated or the entire object that needs to be replaced.
**/
router.route('/edit')
.post(parseUrlEncoded, function(req, res) {

	var query = {};
	var reqObj = req.body;
	query.id = reqObj.id;
	query.userId = reqObj.userId;
	var dataToUpdate = {$set : {"title": reqObj.title}};

	albumsCollection.update(query, dataToUpdate, function(err, docs) {
		if(err) console.log(err);
		console.log('Record updated successfully.');
		res.status(202).send('Record updated successfully.');
	});
});

module.exports = router;
