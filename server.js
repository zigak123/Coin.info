const https = require('https');
const express = require('express')
const app = express()
var http = require('http').Server(app);
const path = require('path')
const mongodbHelper = require('./mongo_helper.js')
const coinApiHelper = require('./coinApi.js')
const mongoose = require('mongoose');
var coinlist = [];
var price = {};
var mongoh = new mongodbHelper('mongodb://localhost:27017/','data');
var User = require('./userSchema.js')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')
var numberOfVisits = 0;
var coinnews = [];

mongoose.connect('mongodb://localhost:27017/data')
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongoose connected!")
});

//coinApiHelper.getNews(function(res){latest_news = res;},1);

/*
coinApiHelper.LoadCoinList(function(res){
	coinlist = res;
	mongoh.MongoInsert(coinlist,'coins',function(insertResult){
		console.log(insertResult);
	})

})
*/

mongoh.MongoFind('coins',function(result){
	coinlist = result;
})

mongoh.MongoCount('coins',function(result){
	console.log('number of coins: '+result);
})

app.use('/public',express.static(path.join(__dirname, 'public')));
//app.set('trust proxy', 1)


app.use(session({
  secret: 'w0rk-harD 3v3Ry dAy',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 600000 },
  store: new MongoStore({ mongooseConnection: db })
}));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
// parse application/json
app.use(bodyParser.json());

//load news from newsAPI


var updateNews = function(){
	console.log('triggering')
	if (coinnews.length == 100) {
		coinApiHelper.loadNewsAsync(2,10).then(function(res){
			var skip = 0;
			while(coinnews[0].title != res[skip].title){
				skip += 1;
			}

			if (skip != 0) {
				coinnews = res.slice(0,skip+1).concat(coinnews);
				coinnews = coinnews.slice(0, 100);
			}
			
		})
		
			
	}
}

var b = coinApiHelper.loadNewsAsync(1,100).then(function(gg){
	console.log('Downloading articles and images: done');
	coinnews = gg;
	setInterval(updateNews, 600000);
})
/*
coinApiHelper.loadNews(articles_limit/100,100, (res)=>{
	console.log('bum done');
	coinnews = res;
	setInterval(updateNews, 600000);
});
*/

//-------------routing----------------------------------------------------------

//var counter = 1;
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
		resp.send(coinlist.slice(req.query.skip, parseInt(req.query.skip)+10));
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

app.post('/user',function(req,res){
	//console.log(req.body);
	if (req.body.email && req.body.username && req.body.password) {

	  imageData = req.body.avatarImage != undefined ? req.body.avatarImage: null;

	  var userData = {
	  	avatarImage: imageData,
	    email: req.body.email,
	    username: req.body.username,
	    password: req.body.password
	  }

	  //insert user into Mongodb
	  User.create(userData, function (err, user) {
	    if (err) {
	      console.log(err)
	      return res.send(err.message)
	    } 
	    else {
	      return res.send({status: 200});
	    }
	  });
	}
	else if (req.body.logemail && req.body.logpassword) {
	    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
	      if (error || !user) {
	        var err = new Error('Wrong email or password.');
	        err.status = 401;
	        return res.send(err);
	      } else {
	        req.session.userId = user._id;
	        return res.send({status: 200});
	      }
	    });
	  }
	  else if(req.session.userId){
	  	if (req.body.signout != undefined) {
	  		req.session.userId = null;
	  		return res.send({signout: true})
	  	}


	  	var query = {"_id":0};
	  	if (req.body.length == 2 && req.body.username && req.body.avatarImage) {
	  		query['avatarImage'] = 1;
	  		query['username'] = 1;
	  	}
	  	else{
	  		for(key in req.body){query[key] = 1;}
	  	}
	  	//console.log(Object.keys(req.body).length)
	  	User.find({_id: req.session.userId},query).exec(function(err, rez){
	  		if (Object.keys(req.body).length == 1 && 'articles' in req.body) {
				article_titles = rez[0].articles.map(function(a){return a.title;});
				return res.send(article_titles);
	  		}
	  		res.send(rez);
	  	})
	  }
	  else if(!req.session.userId){
	  	return res.send({status: 401});
	  }
})

app.get('/', function(req, res){
	if (req.session.views) {
		numberOfVisits++;
		req.session.views = false;
	}
	else{
		req.session.views = true;
	}
	
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
/*io.on('connection', function(socket){
  console.log('a user connected');
});*/

//-----------start server......................
http.listen(3000,function(){
	console.log("Listening on port 3000.")
})
