app.component('profile',{
	bindings: {userStatus: '<'},
	controller: function ($scope,$state,$http) {
		console.log(this)
		$scope.sendForm = function(){
			
			var submitData = {
			'avatarImage': $scope.croppedDataUrl,
			'username':$scope.userName,
			'email': $scope.clientEmail,
			'password': $scope.password
			};

			$http({
			    method: 'POST',
			    url: '/user',
			    data: submitData
			}).then(function(res){
				console.log(res.data)
			})
		}
	
	},
	templateUrl:'/public/templates/profile.html'
})