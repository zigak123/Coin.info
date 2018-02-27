app.controller('priceTickerCtrl', function($scope,tickerSrv) {

	var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD'];

	var ethCall = function(data){
		$scope.ethPrice = data.PRICE;
		$scope.ethColor = data.FLAGS === '1' ? {"color":"green"} : {"color":"red"};
		$scope.ethColor = data.FLAGS === '4' ? {"color":"white"}: $scope.ethColor;
	}


	var btcCall = function(data){
		$scope.btcPrice = data.PRICE;
		$scope.btcColor = data.FLAGS === '1' ? {"color":"green"} : {"color":"red"};
		$scope.btcColor = data.FLAGS === '4' ? {"color":"white"}: $scope.ethColor;
	}

	tickerSrv.subscribe('BTC',btcCall);
	tickerSrv.subscribe('ETH',ethCall);
	//tickerSrv.on('BTC',btcCall);
	//tickerSrv.on('ETH',ethCall);
;
});
