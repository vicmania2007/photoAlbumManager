var express = require('express');
var router = express.Router();
var monk = require('monk');
var bodyParser = require('body-parser');
var parseUrlEncoded = bodyParser.json();

// DB Collection
var db = monk('localhost:27017/photoApp');
var photosCollection = db.get('photos');

/**
	Service: Get photos specific to particular album.
	Requires: albumId
	Result: array of photo ojects
**/
router.route('/album/:albumId')
.get(parseUrlEncoded, function(req, res) {
	var id = parseInt(req.params.albumId);
	var result = [];

	photosCollection.find({albumId: id}, {limit: 10}, function(err, docs){
		if(err) console.log(err);
		result = docs;
		res.json(result);
	}); 
});

/**
	Service: Add a new photo to existing album..
	Requires: new photo object (Sent from front end)
	Result: Null
**/
router.route('/new')
.put(parseUrlEncoded, function(req,res){

	var newPhotoInfo = req.body;

	var newPhotoObj = {
		"albumId" : newPhotoInfo.albumId,
		"title" : newPhotoInfo.title,
		"url" : newPhotoInfo.url,
		"thumbNailUrl" : newPhotoInfo.thumbNailUrl
	};
	photosCollection.insert(newPhotoObj, function(err, docs) {
		if(err) console.log(err);
		res.status(202).send('Record added successfully.');
	});
});

/**
	Service: Get single photo from specified album.
	Requires: photoId, albumId
	Result: photo object
**/
router.route('/photo/:photoId/album/:albumId')
.get(parseUrlEncoded, function(req,res){

	var reqObj = req.body;
	var query = {};
	query.photoId = reqObj.id;
	query.albumId = reqObj.albumId;

	photosCollection.findOne(query, function(err, doc) {
		if(err) console.log(err);
		res.json(doc);
	});
});

/**
	Service: Remove photo from exiting album
	Requires: _id or the photoId (id)
	Result: null
**/
router.route('/remove')
.post(parseUrlEncoded, function(req,res){

	var photoId = req.body._id; //get photo from here
	photosCollection.remove({_id: photoId}, function(err, docs) {
		if(err) console.log(err);
		res.status(202).send('Deleted record successfully');
	});
});

/**
	Service: Edit a photo(url, title etc..)
	Requires: id of the photo.
	Result: field to be updated or the entire object that needs to be replaced.
**/
router.route('/edit')
.post(parseUrlEncoded, function(req,res){

	var query = {};
	var reqObj = req.body;

	query.id = reqObj.id;
	var dataToUpdate = {$set : {"url": reqObj.url}};


	photosCollection.update(query, dataToUpdate, function(err, docs) {
		if(err) console.log(err);
		res.status(202).send('Record updated successfully');
	});
});



module.exports = router;
