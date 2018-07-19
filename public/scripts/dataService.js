app.factory('dataSrv',['$http','$q',function($http,$q){
	var coins = [];
    var currency = 'USD';
    var previous = currency;
	var loadCoins = function(callback, currency){
		if (coins.length == 0) {
			loadMore(0, callback, currency);
		}

		else{
			refreshData(coins, callback, currency);
		}
	}

	var refreshData = function(coins_array, callback, currency){
		var promises = [];
		angular.forEach(coins_array, function(key){
            var promise = getSparklineData(key, currency).then(function(responseData){
                key['lineData'] = responseData;     
            })   
            promises.push(promise);
        });

        $q.all(promises).then(function(){
           	coins = coins_array;
           	callback(coins);
        }); 
	}

	var getSparklineData = function(coin, currency){
            return $http({
                method : "GET",
                url : "https://min-api.cryptocompare.com/data/histoday?fsym="+coin.Symbol+"&tsym="+currency+"&limit=30"
                }).then(function(response) {
                 return response.data.Data.map(function(a){return a.close});
            },function(err){
                return err;
            })
        }

	var loadMore = function(skip, callback, currency){
        $http.get("coinlist?skip="+skip)
            .then(function(response) {
                refreshData(response.data, callback, currency); 
            }); 
    }

    var changeCurrency = function(new_currency){
        previous = currency;
        currency = new_currency;
    }

    var getCurrency = function(){
        return currency;
    }

    var getPrevious = function(){
        return previous;
    } 

	return{
		getCoins: loadCoins,
        setCurrency: changeCurrency,
        getCurrency: getCurrency,
        getPrevious: getPrevious
	}
}])