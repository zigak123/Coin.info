const https = require('https')


	exports.getNews = function (callback, page) {
	api_key = 'f0dfd6aea9364ec7a92ef6d0dba941c5';
	url = "https://newsapi.org/v2/everything?sources=crypto-coins-news&apiKey="+api_key+"&pageSize=12&page="+page;
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