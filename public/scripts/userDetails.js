app.component('userDetails', {
	controller: function ($scope,$http,$state,userSrv,$timeout) {
		// body...
		$scope.userId = $state.params.userId;
		userSrv.authenticated({avatarImage: true, email: true, articles: true}).then(function(res){
			console.log(res)
			$scope.email = res[0].email;
			$scope.articles = res[0].articles;
			$scope.image = String.fromCharCode.apply(null, res[0].avatarImage.data);
		})
	
	},
	templateUrl: 'public/templates/userDetails.html'})