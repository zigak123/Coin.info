const https = require('https');
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
var mongoh = new mongodbHelper('mongodb://localhost:27017/','data');
const coinApiHelper = require('./coinApi.js');
coinApiHelper.add_routing_handler(routingHelper);

var coinlist = [];
var coinnews = [];

mongoose.connect('mongodb://localhost:27017/data')
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongoose connected!")
});

var updateSave = function(res){
	res.map((coin_element) => {
		coin_element.SortOrder = parseInt(coin_element.SortOrder);
		return coin_element;
	})
	coinlist = res;
	
	mongoh.MongoInsert(res,'coins',function(insertResult){
		console.log(insertResult);
	})
}

mongoh.MongoFind('coins',function(result){
	if (result.length == 0) {
		coinApiHelper.LoadCoinList(updateSave);
	}
	else{
		coinlist = result;
	}
})
// serve static files under '/public' virtual path
app.use('/public',express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1)

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

//load and then periodically (10min) update news from newsAPI
var articles_limit = 100;
var updateNews = function(){
	if (coinnews.length == articles_limit) {
		coinApiHelper.loadNewsAsync(2,10).then(function(res){
			var skip = 0;
			while(coinnews[0].title != res[skip].title){
				skip += 1;
			}

			if (skip != 0) {
				console.log('updating with '+skip+' new articles');
				coinnews = res.slice(0,skip+1).concat(coinnews);
				coinnews = coinnews.slice(0, articles_limit);
				routingHelper.update_articles(coinnews);
			}
		})
	}
}

coinApiHelper.loadNewsAsync(articles_limit/100,100).then(function(loaded_articles){
	coinnews = loaded_articles;
	routingHelper.update_articles(loaded_articles);
	console.log('Downloaded '+loaded_articles.length+' articles and images: done');
	setInterval(updateNews, 600000);
})

//-------------routing----------------------------------------------------------

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
	res.sendFile(__dirname +'/public/index.html');
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
	User.update({_id: req.session.userId}, {theme: req.body.theme},function(err){
		//console.log(err)
	})
	res.send('theme updated');
})

//------------------------------------------------------------------------------
var io = require('socket.io')(http);

//------------listening on 'connection' for incoming sockets---------------------
io.on('connection', function(socket){
 
});

//-----------start server......................
http.listen(3000,function(){
	console.log("Listening on port 3000.")
})
