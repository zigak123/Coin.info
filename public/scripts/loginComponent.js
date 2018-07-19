app.component('login',{
	controller: ['$scope','$http','userSrv',function ($scope, $http, userSrv) {
		$scope.signIn = function(){ 
			userSrv.signIn({'logemail': $scope.clientEmail,'logpassword':$scope.password}).then(function(res){
				if (res == 401) {
					$scope.signInForm.password.$setValidity("correctPassword", false);
					$scope.signInForm.clientEmail.$setValidity("correctPassword", false);
				}
			});

			$scope.$watchGroup(['clientEmail','password'], function(){
				$scope.signInForm.clientEmail.$setValidity("correctPassword", true);
				$scope.signInForm.password.$setValidity("correctPassword", true);
			})
		}
	}],
	templateUrl:'public/templates/login.html'
})