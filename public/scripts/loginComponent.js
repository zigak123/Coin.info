app.component('login',{
	controller: function ($scope, $http, userSrv) {
		// body...
		console.log('its working')
		$scope.signIn = function(){$http({
			    method: 'POST',
			    url: '/user',
			    data: {'logemail': $scope.clientEmail,
						'logpassword':$scope.password}
			}).then(function(res){
				console.log(res.data)
			})
		}

	},
	templateUrl:'public/templates/login.html'
})