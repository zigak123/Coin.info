const https = require('https')
const express = require('express')
const app = express()
var http = require('http').Server(app);
const path = require('path')
const mongodbHelper = require('./mongo_helper.js')
const coinApiHelper = require('./coinApi.js')
var coinlist = {};
var price = {};
var latest_news = {};
var mongoh = new mongodbHelper('mongodb://localhost:27017/','data');


function getCurrentPrice(){
	coinApiHelper.getPrice(function(res){
		price['BTC'] = res;
	},'BTC')

	coinApiHelper.getPrice(function(res){
			price['ETH'] = res;
		},'ETH')
}


function getCryptoNews(page){
	coinApiHelper.getNews(function(res){
		latest_news = res;
	},page);
}

getCryptoNews("1");
setInterval(getCurrentPrice,10000);

mongoh.MongoFind('coins',function(result){
	coinlist = result;
})

app.use('/public',express.static(path.join(__dirname, 'public')));
//-------------routing-----------------------
app.get('/news', function(req, resp){
	if (req.query) {
		console.log(req.query)
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
	resp.send(coinlist);
})

app.get('/price', function(req, resp){
	if ("coin" in req.query) {
		coinApiHelper.getPrice(function(result){
			resp.send(result)
		}, req.query.coin)
	}
	else{resp.send(price);}
})

app.get('*', function(req, res){
	res.sendFile(__dirname +'/public/index.html');
})

var io = require('socket.io')(http);

//------------listening on 'connection' for incoming sockets---------------------
io.on('connection', function(socket){
  console.log('a user connected');
});


//-----------start server......................
http.listen(3000,function(){
	console.log("Listening on port 3000.")
})
//app.listen(3000, () => console.log('Example app listening on port 3000!'))