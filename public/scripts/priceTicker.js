app.controller('priceTickerCtrl', function($scope,tickerSrv) {

	var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD'];

	tickerSrv.subscribe('BTC');
	tickerSrv.subscribe('ETH');

	tickerSrv.on('BTC',function(data){
		$scope.btcPrice = data.PRICE;
	})

	tickerSrv.on('ETH',function(data){
		$scope.ethPrice = data.PRICE;
	})
;
});
