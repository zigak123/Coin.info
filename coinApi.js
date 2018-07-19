const https = require('https');
var request = require('request');
var sharp = require('sharp');
var routingHelper;

exports.add_routing_handler = function(routing_helper){
	routingHelper = routing_helper;
}


var getNews = function (callback, page, pageSize,search_tag) {
api_key = 'f0dfd6aea9364ec7a92ef6d0dba941c5';
url = "https://newsapi.org/v2/everything?q="+search_tag+"&sortBy=publishedAt&language=en&apiKey=f0dfd6aea9364ec7a92ef6d0dba941c5&pageSize=100&page=1";
https.get(url, res => {
	 let body = "";

	  res.on("data", data => {
	    body += data;
	  });

	  res.on("end", () => {
	    body = JSON.parse(body);
	    return callback(body);
	  });
	}).on('error', function(e){
		console.log(e)
	});
}

var getNewsImagesAsync = function(uri){
	return new Promise((resolve,reject) => {
		request.head(uri, function(err, res, body){
			if (err) {
				//console.log(err)
				resolve(null);
			}
			var transformer = sharp().resize(112,112);
			request(uri,{forever: true})
			.on("error",function(eer){
				resolve(null);
			})
			.pipe(transformer)
			.toBuffer((error, data, info) => { 
				if (error) {
					resolve(null);
				}
				if (data !== null) {
					resolve("data:;base64," + Buffer(data).toString("base64"));
				}
				else{
					resolve(null);
				}
			})
			
		});
	})
};

var loadNewsAsync = async function(numOfPages,pageSize){
	var promises = [];
	var news500 = [];

	for (var i = 1; i <= numOfPages; i++) {
		var page_promise = new Promise((resolve, reject) => {
			getNews(function(rez){resolve(rez.articles)},i, pageSize,'(blockchain OR bitcoin OR cryptocurrency)');
		});
		news500 = news500.concat(await page_promise);			
	}

	news500.forEach(async function(el, index){
		if (el.urlToImage == null) {
			el.image = null;
		}
		else{
			el.image = await getNewsImagesAsync(el.urlToImage);
		}		
	})		
	return news500;	
}

exports.loadNewsAsync = loadNewsAsync;

var LoadCoinList = function(callback){
	url = "https://www.cryptocompare.com/api/data/coinlist/";
	https.get(url, res => {
	 let body = "";
	  res.on("data", data => {
	    body += data;
	  });
	  res.on("end", () => {
	    body = JSON.parse(body);
		coinlist = [];

		for (var key in body.Data) {coinlist.push(body.Data[key]);}

		return callback(coinlist);
	  });
	});
}

exports.LoadCoinList = LoadCoinList;


exports.updateNews = function(coinnews, articles_limit,callback){
	//console.log('triggering')
	if (coinnews.length == articles_limit) {
		loadNewsAsync(2,10).then(function(res){
			var skip = 0;
			while(coinnews[0].title != res[skip].title){
				skip += 1;
			}

			if (skip != 0) {
				//console.log('updating with '+skip+' new articles');
				coinnews = res.slice(0,skip+1).concat(coinnews);
				coinnews = coinnews.slice(0, articles_limit);
				callback(coinnews);
			}
		})
	}
	callback(coinnews);
}