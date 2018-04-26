app.factory('userSrv',function($http, $q, $state){

	var sendPost = function(sendData){
		return $http({
		    method: 'POST',
		    url: '/user',
		    data: sendData
		})
	}

	var signIn = function(loginData){

		sendPost(loginData).then(function(res){
			console.log(res.data);
			if (res.data.status == 200) {
				$state.go('coinlist');
			}
		})
	}

	var isAthenticated = function(){
		var results = null;
		var deferred = $q.defer();

		sendPost({status: true}).then(function(res){
			results = res.data;
			if (res.data.status == 401) {
				deferred.reject(res.data);
			}
			else{
				deferred.resolve(res.data);
			}
		}, function(error) {
			results = error;
            deferred.reject(error);
          })

		results = deferred.promise;

		return $q.when(results);
	}

	return {
		authenticated: isAthenticated,
		signIn: signIn
	}
})