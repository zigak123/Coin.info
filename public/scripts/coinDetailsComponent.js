app.component('coinDetails',{
templateUrl: '/public/templates/coinDetails.html',
controller: function ($scope, $state, $stateParams, $http, tickerSrv, $transitions) {

	function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var year = a.getFullYear();
      var month = a.getMonth()+1 < 10 ? '0'+(a.getMonth()+1) : a.getMonth()+1;
      var date = a.getDate();
      var time = year + '-' + month + '-' + date;
      return time;
	}

	$scope.isLoading = true;
    $scope.coin_data = $stateParams.coin_data;
    $scope.coin_data.TotalCoinSupply = numeral($scope.coin_data.TotalCoinSupply).format('0,0');
    
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

    $scope.$on('$destroy', function() {
	  tickerSrv.unsub($scope.coin_data.Symbol, panelCall);
	})

    var chart = AmCharts.makeChart("chartdiv",
				{
					"type": "serial",
					"theme": "default",
					"categoryField": "time",
					"dataDateFormat": "YYYY-MM-DD",
					"mouseWheelZoomEnabled": true,
					"autoMarginOffset": 0,
					"marginBottom": 0,
					"marginLeft": 8,
					"marginRight": 0,
					"marginTop": 8,
					"plotAreaBorderAlpha": 0,
					"zoomOutButtonTabIndex": 0,
					"startDuration": 0.35,
					"fontFamily": "Roboto",
					"categoryAxis": {
						"parseDates": true
					},
					"chartCursor": {
						"enabled": true
					},
					"chartScrollbar": {
						"enabled": false,
						"graph": "g1",
						"graphType": "line",
						"scrollbarHeight": 30
					},
					"trendLines": [],
					"graphs": [
						{
							"balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
							"closeField": "close",
							"fillAlphas": 0.9,
							"fillColors": "green",
							"highField": "high",
							"id": "g1",
							"lineColor": "green",
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
					"dataProvider": chartData,
					"export": {
					   "enabled": false
					}
				}
			);

	//angular.element('.md-scroll-mask').hide();
	chart.zoomToIndexes( chart.dataProvider.length - 30, chart.dataProvider.length - 1 );
    tickerSrv.subscribe($stateParams.coin_data.Symbol, panelCall);
	$scope.isLoading = false;

    }, function (err) {
      console.log(err);
  });
  
}
});