
module.exports = class MongoHelper {


	constructor(url,dbname){
		this.url = url;
		this.dbname = dbname;
		this.MongoClient = require('mongodb').MongoClient;
		console.log("MongoHelper initialized!")
	}


	MongoFind(input_collection,callback) {
		var that = this;

	 	this.MongoClient.connect(this.url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(that.dbname);
		  dbo.collection(input_collection).find({"CoinName":{$in:["Bitcoin","Litecoin","Ethereum","DigitalCash","Ripple","Monero","Bitcoin Diamond","IOTA"]}}).toArray(function(err, result) {
		    if (err) throw err;
		    return callback(result)
		    db.close();
		  });
		});
		
	 }  

	 MongoSearch(input_collection,callback,query) {
		var that = this;

	 	this.MongoClient.connect(this.url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(that.dbname);
		  dbo.collection(input_collection).find({"$text":{"$search":query}}).limit(5).toArray(function(err, result) {
		    if (err) throw err;
		    return callback(result)
		    db.close();
		  });
		});
		
	 }  


	MongoInsert(insert_data,input_collection) {
		var that = this;

	 	this.MongoClient.connect(this.url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(that.dbname);
		  dbo.collection(input_collection).insertMany(insert_data, function(err, res) {
		    if (err) throw err;
		    console.log("Number of documents inserted: " + res.insertedCount);
		    db.close();
		  });
		});
	 }  

	 MongoRemove(input_collection,querry) {
	 	var that = this;

	 	this.MongoClient.connect(this.url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(that.dbname);
		  dbo.collection(input_collection).remove(querry, function(err, res) {
		    if (err) throw err;
		    console.log("Number of documents inserted: " + res.insertedCount);
		    db.close();
		  });
		});
	 }  

	 MongoCreateCollection(collection_name) {
	 	
	 	var that = this;
	 	// body...
	 	this.MongoClient.connect(this.url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db(that.dbname);
		  dbo.createCollection(collection_name, function(err, res) {
		    if (err) throw err;
		    console.log("Collection %s created!" % (collection_name));
		    db.close();
		  });
		});

	 }
}