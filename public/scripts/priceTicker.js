app.controller('priceTickerCtrl', function($scope,tickerSrv) {

	var ethCall = function(data){
		$scope.ethPrice = numeral(data.PRICE).format('0,0.00');
		$scope.ethColor = data.FLAGS === '1' ? {"color":"green"} : {"color":"red"};
		$scope.ethColor = data.FLAGS === '4' ? {"color":"white"}: $scope.ethColor;
	}


	var btcCall = function(data){
		$scope.btcPrice = numeral(data.PRICE).format('0,0.00');
		$scope.btcColor = data.FLAGS === '1' ? {"color":"green"} : {"color":"red"};
		$scope.btcColor = data.FLAGS === '4' ? {"color":"white"}: $scope.ethColor;
	}

	tickerSrv.subscribe('BTC',btcCall);
	tickerSrv.subscribe('ETH',ethCall);
;
});
