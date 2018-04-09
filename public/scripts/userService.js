app.factory('userSrv',function($http, $q){

	var sendPost = function(sendData){
		return $http({
		    method: 'POST',
		    url: '/user',
		    data: sendData
		})
	}

	var isAthenticated = function(){
		var results = null;
		var deferred = $q.defer();

		sendPost({status: true}).then(function(res){
			results = res.data;
			console.log(results)
			//if (res.data === 'NOT authenticated!') {deferred.reject(res.data);}
			deferred.resolve(res.data);
			
		}, function(error) {
			results = error;
            deferred.reject(error);
          })

		results = deferred.promise;

		return $q.when(results);
	}

	var signIn = function(){
		var results = null;
		var deferred = $q.defer();

		sendPost({status: true}).then(function(res){
			results = res.data;
			if (res.data === 'NOT authenticated!') {deferred.reject(res.data);}
			else{deferred.resolve(res.data);}
			
		}, function(error) {
			results = error;
            deferred.reject(error);
          })

		results = deferred.promise;

		return $q.when(results);
	}



	return {
		authenticated: isAthenticated
	}
})