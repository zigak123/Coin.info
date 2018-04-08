app.controller('priceTickerCtrl', function($scope, tickerSrv, $state, $transitions,userSrv) {
	var up = "public/images/arrow_up.svg"
	var drop = "public/images/arrow_drop.svg"
	var same = "public/images/minus.svg"

	$transitions.onSuccess({}, function(transition) {
		console.log(transition.from().name+" to"+transition.to().name+" on success")
		$scope.selectedItem = transition.to().name;
		return false
	});

	$transitions.onError({}, function(transition) {
		console.log('error')
		console.log(transition.from().name+" to"+transition.to().name+" on error")
		//$scope.selectedItem = transition.from().name;
		if ($state.current.name != 'coinlist') {$state.go('coinlist')}
		
	});

	var ethCall = function(data){
		$scope.ethPrice = numeral(data.PRICE).format('0,0.00');
		$scope.ethArrow = data.FLAGS === '1' ? up : drop;
		$scope.ethArrow = data.FLAGS === '4' ? same: $scope.ethArrow;
	}


	var btcCall = function(data){
		$scope.btcPrice = numeral(data.PRICE).format('0,0.00');
		$scope.btcArrow = data.FLAGS === '1' ? up : drop;
		$scope.btcArrow = data.FLAGS === '4' ? same: $scope.btcArrow;	

	}

	

	tickerSrv.subscribe('BTC',btcCall);
	tickerSrv.subscribe('ETH',ethCall);
});
