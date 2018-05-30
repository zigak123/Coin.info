app.component('coinDetails',{
templateUrl: '/public/templates/coinDetails.html',
controller: function ($scope, $state, $stateParams, $http, tickerSrv, $transitions,$rootScope,$interval) {
	$scope.candleSizes = [{label: '15min', timeUnit: 'minute', timeSize: 15},{label: '1h', timeUnit: 'hour', timeSize: 1},
	{label: '2h', timeUnit: 'hour', timeSize: 2},{label: '6h', timeUnit: 'hour', timeSize: 6},{label: '1d', timeUnit: 'day', timeSize: 1}]
	$scope.zoomSizes = [{label: '1d', timeUnit: 'day', timeSize: 1},{label: '2d', timeUnit: 'day', timeSize: 2},
	{label: '1w', timeUnit: 'day', timeSize: 7},{label: '1M', timeUnit: 'day', timeSize: 30},{label: 'All', timeUnit: 'day', timeSize: 2000}]
	conversions = {'minute': 1,'hour': 60,'day':1440};

	$scope.selectedZ = $scope.zoomSizes[0];
	$scope.selectedC = $scope.candleSizes[4];
	var chart = undefined;
	$scope.isLoading = true;
    $scope.coin_data = $stateParams.coin_data;
    $scope.coin_data.TotalCoinSupply = numeral($scope.coin_data.TotalCoinSupply).format('0,0');


    var panelCall =  function (data) {
 		$scope.volume = numeral(data.VOLUME24HOUR).format('0,0.00');
        $scope.price = data.PRICE;
        $scope.data = data;
        $scope.high24hour = data.HIGH24HOUR ? data.HIGH24HOUR: $scope.high24hour;
        $scope.low24hour = data.LOW24HOUR ? data.LOW24HOUR: $scope.low24hour;
        temp = ($scope.price / oldprice) > 1 ? ($scope.price / oldprice) - 1 : -1*(1 - ($scope.price / oldprice));
        $scope.change = numeral(temp*100).format('0,0.00');
        $scope.price_color = $scope.change >= 0.0 ? {"color":"limegreen"} : {"color":"red"};
        $scope.priceArrow = $scope.change >= 0.0 ? "public/images/arrow_up.svg":"public/images/arrow_drop.svg"
       
        $scope.last_market = data.LASTMARKET;
        var num_format = $scope.price >= 0.1 ? '0,0.00':'0,0.000';
        $scope.price = numeral($scope.price).format(num_format);
    }
    	var chartTheme = $rootScope.currentTheme === 'default' ? 'default':'dark';
		var chartConfig = {
				"type": "serial",
				"theme": chartTheme,
				"categoryField": "time",
				"dataDateFormat": "YYYY-MM-DD",
				"mouseWheelZoomEnabled": true,
				"autoMarginOffset": 0,
				"marginBottom": 0,
				"marginLeft": 8,
				"marginRight": 16,
				"marginTop": 8,
				"plotAreaBorderAlpha": 0.1,
				"zoomOutButtonTabIndex": 0,
				"startDuration": 0.25,
				"fontFamily": "Roboto",
				"categoryAxis": {
					"parseDates": true
				},
				"chartCursor": {
					"enabled": true
				},
				"chartScrollbar": {
					"enabled": true,
					"graph": "g1",
					"graphType": "line",
					"scrollbarHeight": 30
				},
				"trendLines": [],
				"graphs": [
					{
						"balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
						"closeField": "close",
						"fillAlphas": 0.85,
						"fillColors": "limegreen",
						"highField": "high",
						"id": "g1",
						"lineColor": "limegreen",
						"lowField": "low",
						"negativeFillColors": "red",
						"negativeLineColor": "red",
						"openField": "open",
						"title": "Price:",
						"type": "candlestick",
						"valueField": "close"
					}
				],
				"guides": [],
				"valueAxes": [
					{
						"id": "ValueAxis-1"
					}
				],
				"allLabels": [],
				"balloon": {},
				"titles": [],
				"dataProvider": undefined,
				"export": {
				   "enabled": false
				}
			}

	   var chart = AmCharts.makeChart("chartdiv", chartConfig);


       var loadPriceData = function(){
       		cc = $scope.selectedC.timeSize*conversions[$scope.selectedC.timeUnit];
       		dd = $scope.selectedZ.timeSize*conversions[$scope.selectedZ.timeUnit];

			$http({
			    method : "GET",
			    url : "https://min-api.cryptocompare.com/data/histo"+$scope.selectedC.timeUnit+"?fsym="+$scope.coin_data.Symbol+"&tsym=USD&limit="+(dd/cc)+"&aggregate="+$scope.selectedC.timeSize}).then(function(res){
			    	
			    chartData = res.data.Data;
			    for (var i = 0; i < chartData.length; i++) {
			    	chartData[i].time = $scope.selectedC.timeUnit == 'day' ? timeConverter(chartData[i].time).split(" ")[0] : timeConverter(chartData[i].time);
			    }
				chart.categoryAxis.minPeriod = $scope.selectedC.timeUnit == 'day' ? 'DD': ($scope.selectedC.timeUnit == 'hour' ? 'hh':'mm');
				chart.dataDateFormat = $scope.selectedC.timeUnit == 'day' ? chart.dataDateFormat = "YYYY-MM-DD" : "YYYY-MM-DD JJ:NN";
			    chart.dataProvider = chartData;
			    chart.validateData();
			})
    	}


    	var getCoinSnapshot = function(){
    		$http({
			    method : "GET",
			    url : "https://min-api.cryptocompare.com/data/top/exchanges/full?fsym="+$scope.coin_data.Symbol+"&tsym=USD"
			}).then(function(response){
				$scope.coin_supply = numeral(response.data.Data.CoinInfo.TotalCoinsMined).format('0,0.00');
				$scope.coin_block_number = numeral(response.data.Data.CoinInfo.BlockNumber).format('0,0.00');
			})
    	};

    	

    $scope.changeZoom = function(newZoom){
    	if ($scope.selectedZ != newZoom) {
    		$scope.selectedZ = newZoom;
    		loadPriceData();
    	}
    };

    $scope.changeCandle = function(newCandle){
    	if ($scope.selectedC != newCandle) {
    		$scope.selectedC = newCandle;
    		loadPriceData();
    	}
    };

    $scope.$on('$destroy', function() {
	  tickerSrv.unsub($scope.coin_data.Symbol, panelCall);
	})


   $http({
    method : "GET",
    url : "https://min-api.cryptocompare.com/data/histoday?fsym="+$scope.coin_data.Symbol+"&tsym=USD&limit=365"
	}).then(function(response) {

     chartData = response.data.Data;
     for (var i = 0; i < chartData.length; i++) {
     	chartData[i].time = timeConverter(chartData[i].time);
     }

    n = response.data.Data.length;
    oldprice = (response.data.Data[n-1].open);
    chart.dataProvider = chartData;
     
    chart.validateData()
	chart.zoomToIndexes( chart.dataProvider.length - 30, chart.dataProvider.length - 1 );
    tickerSrv.subscribe($stateParams.coin_data.Symbol, panelCall);
	$scope.isLoading = false;

    }, function (err) {
      console.log(err);
  });

	getCoinSnapshot();
  
}
});