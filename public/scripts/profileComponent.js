app.component('profile',{
	bindings: {testingthis: '<'},
	controller: function ($scope,$state,$http) {
		
		$scope.sendForm = function(){

			var submitData = {
			'username':$scope.userName,
			'email': $scope.clientEmail,
			'password': $scope.password
			};

			$http({
			    method: 'POST',
			    url: '/user',
			    data: submitData
			}).then(function(res,err){
				console.log('done: '+res.data)
			})
		}
	
	},
	templateUrl:'/public/templates/profile.html'
})