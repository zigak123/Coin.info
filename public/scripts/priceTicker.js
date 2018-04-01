app.controller('priceTickerCtrl', function($scope, tickerSrv, $state, $transitions) {
	var up = "public/images/arrow_up.svg"
	var drop = "public/images/arrow_drop.svg"
	var same = "public/images/minus.svg"

	$transitions.onSuccess({}, function() {
		$scope.selectedItem = $state.current.name;
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
;
});
