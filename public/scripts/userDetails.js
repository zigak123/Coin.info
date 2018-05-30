app.component('userDetails', {
	controller: function ($scope,$http,$state,userSrv,$timeout) {
		// body...
		$scope.userId = $state.params.userId;
		userSrv.authenticated({avatarImage: true, email: true}).then(function(res){
			console.log(res)
			$scope.image = String.fromCharCode.apply(null, res[0].avatarImage.data);
		})
	
	},
	templateUrl: 'public/templates/userDetails.html'})