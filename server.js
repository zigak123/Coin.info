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
var User = require('./userSchema.js')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/data')
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongoose connected!")
});

coinApiHelper.getNews(function(res){latest_news = res;},1);

/*
coinApiHelper.LoadCoinList(function(res){
	coinlist = res;
	mongoh.MongoInsert(coinlist,'coins')
})
*/

mongoh.MongoFind('coins',function(result){coinlist = result;})

app.use('/public',express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
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
		resp.send(coinlist.slice(req.query.b, parseInt(req.query.b)+10));
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

app.post('/user',function(req,res,next){
	console.log(req.body);
	if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {

	  var userData = {
	    email: req.body.email,
	    username: req.body.username,
	    password: req.body.password,
	    passwordConf: req.body.passwordConf,
	  }
	  //use schema.create to insert data into the db
	  User.create(userData, function (err, user) {
	    if (err) {
	      return next(err)
	    } else {
	      return res.send(user);
	    }
	  });
	}
	else if (req.body.logemail && req.body.logpassword) {
	    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
	      if (error || !user) {
	        var err = new Error('Wrong email or password.');
	        err.status = 401;
	        return next(err);
	      } else {
	        req.session.userId = user._id;
	        return res.send('you did it, you signed in!'+' '+req.session.userId+" real id:"+req.session.id+" "+user);
	      }
	    });
  }
  else{
  	User.find({_id: req.session.userId}).exec(function(err, res){
  		console.log(res)
  	})
  	return res.send('it really is empty!'+' '+req.session.userId)
  }
})

app.get('/', function(req, res){
	/*
	if (req.session.views) {
		req.session.views++;
	}
	else{
		req.session.views = 1;
	}
	console.log(req.session.id+" views:"+req.session.views)
	*/
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