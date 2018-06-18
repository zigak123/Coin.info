app.component('coinDetails',{
templateUrl: '/public/templates/coinDetails.html',
controller: function ($scope, $state, $stateParams, $http, tickerSrv, $transitions,$rootScope,$interval,$mdMedia,$timeout) {
	$scope.isLoading = true;
	$scope.candleSizes = [{label: '15min', timeUnit: 'minute', timeSize: 15},{label: '1h', timeUnit: 'hour', timeSize: 1},
	{label: '2h', timeUnit: 'hour', timeSize: 2},{label: '6h', timeUnit: 'hour', timeSize: 6},{label: '1d', timeUnit: 'day', timeSize: 1}]
	$scope.zoomSizes = [{label: '1d', timeUnit: 'day', timeSize: 1},{label: '2d', timeUnit: 'day', timeSize: 2},
	{label: '1w', timeUnit: 'day', timeSize: 7},{label: '1M', timeUnit: 'day', timeSize: 30},{label: 'All', timeUnit: 'day', timeSize: 2000}]
	conversions = {'minute': 1,'hour': 60,'day':1440};
	$scope.selectedZ = $scope.zoomSizes[4];
	$scope.selectedC = $scope.candleSizes[4];
    $scope.coin_data = $stateParams.coin_data;
    $scope.coin_data.TotalCoinSupply = numeral($scope.coin_data.TotalCoinSupply).format('0,0');
    $scope.selectedChart = "candlestick";
    var chartTheme = $rootScope.currentTheme === 'default' ? 'default':'dark';
	var showScrollBar = $mdMedia('gt-sm');
	var chart = undefined;
	var busy = false;

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
        var num_format = $scope.price >= 0.5 ? '0,0.00':'0,0.0000';
        $scope.coin_market_cap = numeral($scope.coin_supply_int * $scope.price).format('0,0');


        if (chart) {

        	var data_length = chart.dataSets[0].dataProvider.length;
        	var last = new Date(chart.dataSets[0].dataProvider[data_length-1].time);
        	var now = new Date();


        	if ($scope.selectedC.label === '15min' && now - last > 900000 && !busy) {
        		busy = true;
        		addCandle().then(function(new_candle){
        			if (new Date(new_candle.Data[2].time*1000) - new Date(chart.dataSets[0].dataProvider[data_length-1].time) >= 900000) {
	        			chart.dataSets[0].dataProvider[data_length-1].volumefrom = new_candle.Data[1].volumefrom;
	        			chart.dataSets[0].dataProvider[data_length-1].high = new_candle.Data[1].high;
	        			chart.dataSets[0].dataProvider[data_length-1].low = new_candle.Data[1].low;
	        			chart.dataSets[0].dataProvider[data_length-1].close = new_candle.Data[1].close;
	        			chart.dataSets[0].dataProvider[data_length-1].open = new_candle.Data[1].open;
	        			chart.dataSets[0].dataProvider[data_length-1].time = timeConverter(new_candle.Data[1].time);
	        			chart.dataSets[0].dataProvider.shift();
	        			chart.dataSets[0].dataProvider.push({"time": timeConverter(new_candle.Data[2].time),
	        												"close": new_candle.Data[2].close,
	        												"open": new_candle.Data[2].open,
	        												"high": new_candle.Data[2].high,
	        												"low": new_candle.Data[2].low,
	        												"volumefrom": new_candle.Data[2].volumefrom});
	        			chart.validateData();
	        			//chart.zoom(new Date(chart.dataSets[0].dataProvider[data_length-24].time), new Date());
        			}
        		
        			busy = false;
        		});
        		
        	}
        	else if($scope.selectedC.label === '15min'){
        		chart.dataSets[0].dataProvider[data_length-1].close = $scope.price;
        		chart.dataSets[0].dataProvider[data_length-1].high = chart.dataSets[0].dataProvider[data_length-1].close > chart.dataSets[0].dataProvider[data_length-1].high ? $scope.price : chart.dataSets[0].dataProvider[data_length-1].high;
        		chart.dataSets[0].dataProvider[data_length-1].low = chart.dataSets[0].dataProvider[data_length-1].close < chart.dataSets[0].dataProvider[data_length-1].low ? $scope.price : chart.dataSets[0].dataProvider[data_length-1].low;
        		chart.validateData();    		
        	}

        }
        $scope.price = numeral($scope.price).format(num_format);
    }

    var addCandle = function(){
    	 return $http({
		    method : "GET",
		    url : "https://min-api.cryptocompare.com/data/histominute?fsym="+$scope.coin_data.Symbol+"&tsym=USD&limit=2&aggregate=15"
		}).then(function(response) {
			return response.data;

		})
    }
   

   var loadPriceData = function(){
   		cc = $scope.selectedC.timeSize*conversions[$scope.selectedC.timeUnit];
   		dd = $scope.selectedZ.timeSize*conversions[$scope.selectedZ.timeUnit];

		$http({
		    method : "GET",
		    url : "https://min-api.cryptocompare.com/data/histo"+$scope.selectedC.timeUnit+"?fsym="+$scope.coin_data.Symbol+"&tsym=USD&limit="+(dd/cc)+"&aggregate="+$scope.selectedC.timeSize
		})
		.then(function(res){
		    chartData = res.data.Data;
		    for (var i = 0; i < chartData.length; i++) {
		    	chartData[i].time = $scope.selectedC.timeUnit == 'day' ? timeConverter(chartData[i].time).split(" ")[0] : timeConverter(chartData[i].time);
		    }
		    chart.dataDateFormat = "YYYY-MM-DD JJ:NN";
			chart.categoryAxesSettings.minPeriod = $scope.selectedC.timeUnit == 'day' ? 'DD': ($scope.selectedC.timeUnit == 'hour' ? 'hh':'15mm');
		    chart.dataSets[0].dataProvider = chartData;
		    chart.chartScrollbarSettings.usePeriod = chart.categoryAxesSettings.minPeriod;

		    chart.validateData();
		   	try{
		   		chart.zoom(new Date(chartData[Math.ceil(chartData.length/2)].time),new Date(chartData[chartData.length-1].time));

		   	}
		   	catch(err){
		   		chart.categoryAxesSettings.minPeriod = "mm"
		   		chart.zoom(new Date(chartData[Math.ceil(chartData.length/2)].time),new Date(chartData[chartData.length-1].time));
		   		chart.categoryAxesSettings.minPeriod = "15mm"
		   		chart.zoom(new Date(chartData[Math.ceil(chartData.length/2)].time),new Date(chartData[chartData.length-1].time));
		   	}
		},function(err){
			console.log(err)
		})
	}


	var getCoinSnapshot = function(){
		$http({
		    method : "GET",
		    url : "https://min-api.cryptocompare.com/data/top/exchanges/full?fsym="+$scope.coin_data.Symbol+"&tsym=USD"
		}).then(function(response){
			$scope.coin_supply_int = response.data.Data.CoinInfo.TotalCoinsMined;
			$scope.coin_supply = numeral($scope.coin_supply_int).format('0,0');
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

	$scope.changeChartType = function(chart_type){
		console.log('changing chart type to '+chart_type);
		chart.panels[0].stockGraphs[0].type = chart_type;
		$scope.selectedChart = chart_type;
		if (chart_type == 'line') {
			//chart.panels[0].stockGraphs[0].lineThickness = 1;
			chart.panels[0].stockGraphs[0].fillAlphas = 0;
			//chart.categoryAxesSettings.groupToPeriods = [chart.categoryAxesSettings.minPeriod];
			chart.validateData();
			
			//chart.validateData();
		}
		else{
			chart.panels[0].stockGraphs[0].fillAlphas = 1;
			chart.validateData();
		}
		chart.validateNow();
	}

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

     var animate_duration = $mdMedia('gt-md') ? 0.9 : 0;
     chart = AmCharts.makeChart( "chartdiv", {
  "type": "stock",
  "theme": chartTheme,
  "marginRight": "50",
  "dataSets": [ {
    "fieldMappings": [ {
      "fromField": "open",
      "toField": "open"
    }, {
      "fromField": "close",
      "toField": "close"
    }, {
      "fromField": "high",
      "toField": "high"
    }, {
      "fromField": "low",
      "toField": "low"
    }, {
      "fromField": "volumefrom",
      "toField": "volumefrom"
    }],
    "color": "#7f8da9",
    "dataProvider": chartData,
    "title": "Coin value",
    "categoryField": "time"
  }],


  "glueToTheEnd": true,


  "panels": [ {
      "title": "Price",
      "showCategoryAxis": false,
      "fontFamily": "Roboto",
      "percentHeight": 70,
      "hideCredits":true,
      "valueAxes": [ {
        "id": "v1",
        "dashLength": 5
      } ],
      "startDuration": animate_duration,

      "categoryAxis": {
        "dashLength": 5
      },

      "stockGraphs": [ {
        "type": "candlestick",
        "id": "g1",
        "openField": "open",
        "closeField": "close",
        "highField": "high",
        "lowField": "low",
        "valueField": "close",
        "lineColor": "#7f8da9",
        "fillColors": "#7f8da9",
        "negativeLineColor": "#db4c3c",
        "negativeFillColors": "#db4c3c",
        "fillAlphas": 1,
        "useDataSetColors": false,
        "comparable": true,
        "compareField": "value",
        "showBalloon": true,
        "balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
        "proCandlesticks": true
      }
      ],

      "stockLegend": {
        "markerType": "none",
        "markerSize": 0,
        "labelText": "",
        "periodValueTextComparing": "[[percents.value.close]]%"
      }
    },

    {
      "title": "Volume",
      "percentHeight": 30,
      "showCategoryAxis": true,
      "hideCredits":true,
      "fontFamily": "Roboto",
      "valueAxes": [ {
        "dashLength": 5,
        "usePrefixes": true
      } ],

      "categoryAxis": {
        "dashLength": 5
      },

      "stockGraphs": [ {
        "valueField": "volumefrom",
        "type": "column",
        "showBalloon": false,
        "fillAlphas": 1
      } ],

      "stockLegend": {
        "markerType": "none",
        "markerSize": 0,
        "labelText": "",
        "periodValueTextComparing": "[[value.close]]"
      }
    }
  ],

  "chartScrollbarSettings": {
    "graph": "g1",
    "graphType": "line",
    "usePeriod": "DD",
    "position": "top",
    "height": 34,
    "enabled": showScrollBar
  },

  "valueAxesSettings": {
    "inside": false,
    "showFirstLabel": false
  },

  "chartCursorSettings": {
    "valueLineBalloonEnabled": true,
    "valueLineEnabled": false,
    "fullWidth": true,
    "cursorAlpha": 0.1
  },
  "export": {
    "enabled": false
  },
  "panelsSettings":{
  	"marginLeft": 48,
  	"marginRight": 18
  }
} );
    chart.zoom(new Date(chartData[chartData.length-61].time),new Date());
    n = response.data.Data.length;
    oldprice = (response.data.Data[n-1].open);
    tickerSrv.subscribe($stateParams.coin_data.Symbol, panelCall);
    
	$scope.isLoading = false;
    }, function (err) {
      console.log(err);
  });

	getCoinSnapshot();
}
});