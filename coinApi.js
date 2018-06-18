const https = require('https');
var request = require('request');
var sharp = require('sharp');


	var getNews = function (callback, page, pageSize) {
	api_key = 'f0dfd6aea9364ec7a92ef6d0dba941c5';
	url = "https://newsapi.org/v2/everything?q='bitcoin OR (blockchain OR cryptocurrency)'&sortBy=publishedAt&language=en&apiKey="+api_key+"&pageSize="+pageSize+"&page="+page;
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

	exports.getNews = getNews;


	var getNewsImages = function(uri, callback){
	    request.head(uri, function(err, res, body){
	    	if (res != undefined) {
    			request(uri).pipe(sharp().resize(112,112)).toBuffer((err, data, info) => { 
    				if (data !== null) {
    					callback("data:" + res.headers["content-type"] + ";base64," + Buffer(data).toString("base64"));
    				}
    				else{
    					callback(null);
    				}
    			});
	    	}   		
  		});
	};

	var getNewsImagesAsync = function(uri){
		return new Promise((resolve,reject) => {
			request.head(uri, function(err, res, body){
	    	if (res != undefined) {
    			request(uri).pipe(sharp().resize(112,112)).toBuffer((error, data, info) => { 
    				if (error) {
    					reject('there is an error with downloading from url: ' + uri);
    				}
    				if (data !== null) {
    					resolve("data:" + res.headers["content-type"] + ";base64," + Buffer(data).toString("base64"));
    				}
    				else{
    					resolve(null);
    				}
    			});
	    	}   		
  		});
		})
	};

	exports.loadNewsAsync = async function(numOfPages,pageSize){
		var promises = [];
	
		for (var i = 1; i <= numOfPages; i++) {
			var page_promise = new Promise((resolve, reject) => {
				getNews(function(rez){resolve(rez.articles)},i, pageSize);
			});
			promises.push(page_promise);			
		}

		return Promise.all(promises).then(async function(stuff){
			var news500 = [];
			for (var i = 0; i < stuff.length; i++) {
				news500 = news500.concat(stuff[i]);
			}

			news500.forEach(async function(el, index){
				var articled_image = await getNewsImagesAsync(el.urlToImage);
				el.image = articled_image;		
			})		
			return news500;
			
		});
	}

	exports.loadNews = function(numOfPages,pageSize,callback){
		var promises = [];
	
		for (var i = 1; i <= numOfPages; i++) {
			var page_promise = new Promise((resolve, reject) => {
				getNews(function(rez){resolve(rez.articles)},i, pageSize);
			});
			promises.push(page_promise);			
		}

		Promise.all(promises).then(function(stuff){
			var news500 = [];
			for (var i = 0; i < stuff.length; i++) {
				news500 = news500.concat(stuff[i]);
			}

			news500.forEach(function(el, index){
				setTimeout(function() {
					getNewsImages(el.urlToImage, function(rez){
						el.image = rez;
						if (index == news500.length-1) {
							callback(news500);
						}
					});					
				}, index*50);
			})		
		});
	}




	exports.getPrice = function (callback, fsyms) {
	url = "https://min-api.cryptocompare.com/data/price?fsym="+fsyms+"&tsyms=USD,EUR";
	https.get(url, res => {
		 let body = "";

		  res.on("data", data => {
		    body += data;
		  });

		  res.on("end", () => {
		    body = JSON.parse(body);
		    return callback(body);
		  });
		});
	}


	exports.getHistoricalPrice = function (callback, query, coinSymbol) {
	url = "https://min-api.cryptocompare.com/data/"+query+"?fsym="+coinSymbol+"&tsyms=USD&limit=30";
	https.get(url, res => {
		 let body = "";

		  res.on("data", data => {
		    body += data;
		  });

		  res.on("end", () => {
		    body = JSON.parse(body);
		    return callback(body);
		  });
		});
	}



	exports.LoadCoinList = function(callback){
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