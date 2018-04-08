app.factory('userSrv',function($http){

	var isAthenticated = function(){
		console.log('is authenticated?')

		$http({
		    method: 'POST',
		    url: '/user',
		    data: {stuff: true,haha:false}
		}).then(function(res){
			console.log(res.data)
		})


		return true;
	}


	return {
		authenticated: isAthenticated
	}
})