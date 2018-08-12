var config = require('./conf.json')[process.env.NODE_ENV];
const express = require('express')
const app = express()
var http = require('http').Server(app);
const path = require('path')
const mongoose = require('mongoose');
var User = require('./userSchema.js')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')
var routingHelper = require('./routing.js');
const mongodbHelper = require('./mongo_helper.js');
var mongoh = new mongodbHelper('mongodb://coininfo93mongo:dv8ES51LRoK11R86eiKSfmQXcHuJQZDFgBAXBttnoRmna709lY6sNOLXSrZu2RnKUw5thDy9Ep5cUUIxPXy4gQ%3D%3D@coininfo93mongo.documents.azure.com:10255/?ssl=true','data');
const dataHelper = require('./coinLoader.js');
const coinApiHelper = require('./coinApi.js');
coinApiHelper.add_routing_handler(routingHelper);
var coinlist, coinnews = [];
// connect to mongoDB with mongoose
mongoose.connect('mongodb://coininfo93mongo:dv8ES51LRoK11R86eiKSfmQXcHuJQZDFgBAXBttnoRmna709lY6sNOLXSrZu2RnKUw5thDy9Ep5cUUIxPXy4gQ%3D%3D@coininfo93mongo.documents.azure.com:10255/data?ssl=true')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("mongoose connected!")});

const indexPage = path.join(__dirname,config["dir"],'templates/index.html');
// serve static files under '/public' virtual path
app.use(config["dir"],express.static(path.join(__dirname,config["dir"])));
app.set('trust proxy', 1)
// session settings
app.use(session({
  secret: 'w0rk-harD 3v3Ry dAy.',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 600000 },
  store: new MongoStore({ mongooseConnection: db })
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
// parse application/json
app.use(bodyParser.json());
// load coins from db, if db is empty, then download and save coins to db
var updateSave = function(res){
	coinlist = dataHelper.sortCoins(res);
	mongoh.MongoInsert(coinlist,'coins',function(insertResult){console.log(insertResult);})
}

mongoh.MongoFind('coins',function(result){
	if (result.length == 0) { coinApiHelper.LoadCoinList(updateSave);}
	else{
		coinlist = result;
		routingHelper.update_coins(coinlist);
	}
})
//load and then periodically (10min) update news from newsAPI
coinApiHelper.loadNewsAsync(1,100).then(function(loaded_articles){
	coinnews = loaded_articles;
	routingHelper.update_articles(coinnews);
	setInterval(coinApiHelper.updateNews, 600000,coinnews,100,function(new_articles){coinnews=new_articles;routingHelper.update_articles(coinnews);});
})
//-----------------------------routing----------------------------------------------------------
app.get('/news', function(req, resp){
	if (req.query) {
		resp.send(coinnews.slice((req.query.page*10)-10, req.query.page*10))
	}
})

app.get('/search', function(req, resp){
	mongoh.MongoSearch('coins',function(result){
		resp.send(result);
	},req.query.text)
})

app.get('/coinlist', function(req, resp){
	if ("skip" in req.query) {
		resp.send(coinlist.slice(req.query.skip, parseInt(req.query.skip)+12));
	}
})

app.post('/user',function(req,res){
	routingHelper.handle_request(req,res);
})

app.get('/', function(req, res){
	res.sendFile(indexPage);
})

app.post('/save', function(req, res){
	if (req.session.userId == undefined) {return;}
	User.update({_id: req.session.userId}, {$push: {articles: req.body}},{safe: true, new : true},function(err){
	})
	res.send('saved');
})

app.post('/delete', function(req, res){
	if (req.session.userId == undefined) {return;}
	User.update({_id: req.session.userId}, {$pull: {articles: {title: req.body.title}}},{safe: true, new : true},function(err){
		//console.log(err)
	})
	res.send('deleted');
})

app.post('/theme', function(req, res){
	if (req.session.userId == undefined) {return;}
	User.update({_id: req.session.userId}, {theme: req.body.theme},function(err){/*console.log(err)*/})
	res.send('theme updated');
})
//------------------------------------------------------------------------------
var io = require('socket.io')(http);
//-----------start server-------------------------------------------------------
http.listen(config["port"],function(){
	console.log("Listening on port "+config["port"])
})
