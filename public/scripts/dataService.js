app.factory('dataSrv',function($http,$q){
	var coins = [];

	var loadCoins = function(callback){
		if (coins.length == 0) {
			loadMore(0, callback);
		}

		else{
			refreshData(coins, callback);
		}
	}

	var refreshData = function(coins_array, callback){
		var promises = [];
		angular.forEach(coins_array, function(key){
            var promise = getSparklineData(key).then(function(responseData){
                key['lineData'] = responseData;     
            })   
            promises.push(promise);
        });

        $q.all(promises).then(function(){
           	coins = coins_array;
           	callback(coins);
        }); 
	}

	var getSparklineData = function(coin){
            return $http({
                method : "GET",
                url : "https://min-api.cryptocompare.com/data/histoday?fsym="+coin.Symbol+"&tsym=USD&limit=30"
                }).then(function(response) {
                 return response.data.Data.map(a => Math.round(a.close * 100) / 100);
            },function(err){
                return err;
            })
        }

	var loadMore = function(skip, callback){
        $http.get("coinlist?skip="+skip)
            .then(function(response) {
                refreshData(response.data, callback); 
            }); 
    }


	return{
		getCoins: loadCoins
	}
})