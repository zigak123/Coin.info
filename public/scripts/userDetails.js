app.component('userDetails', {
	controller: function ($scope,$http,$state) {
		// body...
		$scope.userId = $state.params.userId;
	},
	templateUrl: 'public/templates/userDetails.html'})