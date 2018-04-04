const https = require('https')
const express = require('express')
const app = express()
var http = require('http').Server(app);
const path = require('path')
const mongodbHelper = require('./mongo_helper.js')
const coinApiHelper = require('./coinApi.js')
const mongoose = require('mongoose');
var coinlist = {};
var price = {};
var latest_news = {};
var mongoh = new mongodbHelper('mongodb://localhost:27017/','data');
mongoose.connect('mongodb://localhost:27017/data')
var Schema = mongoose.Schema;
var myschema = new Schema({name: String});
var Model = mongoose.model('testmodel', myschema)
var User = require('./userSchema.js')
var session = require('express-session')
var bodyParser = require('body-parser')



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("done")
});


function getCryptoNews(page){
	coinApiHelper.getNews(function(res){
		latest_news = res;
	},page);
}

getCryptoNews("1");

mongoh.MongoFind('coins',function(result){
	coinlist = result;
})

app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//-------------routing----------------------------------------------------------
app.get('/news', function(req, resp){
	if (req.query) {
		coinApiHelper.getNews(function(result){
			resp.send(result);
		},req.query.page)
	}

	else{
		resp.send(latest_news);
	}
})

app.get('/search', function(req, resp){
	mongoh.MongoSearch('coins',function(result){
		resp.send(result);
	},req.query.text)
})

app.get('/coinlist', function(req, resp){
	if ("b" in req.query) {
		resp.send(coinlist.slice(req.query.b, parseInt(req.query.b)+5));
	}
})

app.get('/price', function(req, resp){
	if ("coin" in req.query) {
		coinApiHelper.getPrice(function(result){
			resp.send(result)
		}, req.query.coin)
	}
	else{resp.send(price);}
})

app.post('/createUser',function(req,res){
	console.log(req.body.username);
	res.send('got it')
})

app.get('*', function(req, res){
	res.sendFile(__dirname +'/public/index.html');
})

//------------------------------------------------------------------------------

var io = require('socket.io')(http);

//------------listening on 'connection' for incoming sockets---------------------
/*io.on('connection', function(socket){
  console.log('a user connected');
});*/


//-----------start server......................
http.listen(3000,function(){
	console.log("Listening on port 3000.")
})
//app.listen(3000, () => console.log('Example app listening on port 3000!'))