app.component('login',{
	controller: function ($scope, $http, userSrv) {

		$scope.signIn = function(){ 
			userSrv.signIn({'logemail': $scope.clientEmail,'logpassword':$scope.password});
		}
	},
	templateUrl:'public/templates/login.html'
})