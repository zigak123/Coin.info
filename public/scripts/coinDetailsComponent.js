app.component('coinDetails',{
templateUrl: '/public/templates/coinDetails.html',
controller: function ($scope, $state, $stateParams, $http, tickerSrv, $transitions,$rootScope,$interval,$mdMedia,$timeout, dataSrv) {
	if($stateParams.coin_data == null){
		$state.go('coinlist');
	}
	$scope.isLoading = true;
	$scope.candleSizes = [{label: '15min', timeUnit: 'minute', timeSize: 15,periods:['15mm']},{label: '1h', timeUnit: 'hour', timeSize: 1,periods:['hh','DD']},
	{label: '2h', timeUnit: 'hour', timeSize: 2,periods:['2hh','DD']},{label: '6h', timeUnit: 'hour', timeSize: 6,periods:['6hh','DD']},{label: '1d', timeUnit: 'day', timeSize: 1,periods:['DD','WW']}]
	$scope.zoomSizes = [{label: '1d', timeUnit: 'day', timeSize: 1},{label: '2d', timeUnit: 'day', timeSize: 2},
	{label: '1w', timeUnit: 'day', timeSize: 7},{label: '1M', timeUnit: 'day', timeSize: 30},{label: '1Y', timeUnit: 'day', timeSize: 365}]
	conversions = {'minute': 1,'hour': 60,'day':1440};
	$scope.selectedZ = $scope.zoomSizes[4];
	$scope.selectedC = $scope.candleSizes[4];
    $scope.coin_data = $stateParams.coin_data;
    $scope.coin_data.TotalCoinSupply = numeral($scope.coin_data.TotalCoinSupply).format('0,0');
    $scope.selectedChart = 'line';
    $scope.movingAverage = false;
    $scope.movingAverage200 = false;
    var chartTheme = $rootScope.currentTheme === 'default' ? 'default':'dark';
	var chart = undefined;
	var busy = false;
	var roundCurrency = {"BTC": 8, "EUR": 2, "USD": 2};
	var numbertoround = roundCurrency[dataSrv.getCurrency()];

    var panelCall =  function (data) {
 		$scope.volume = numeral(data.VOLUME24HOUR).format('0,0.00');
        $scope.price = Number(data.PRICE.toString());
        $scope.data = data;
        $scope.high24hour = data.HIGH24HOUR ? data.HIGH24HOUR: $scope.high24hour;
        $scope.low24hour = data.LOW24HOUR ? data.LOW24HOUR: $scope.low24hour;
        temp = ($scope.price / oldprice) > 1 ? ($scope.price / oldprice) - 1 : -1*(1 - ($scope.price / oldprice));
        $scope.change = numeral(temp*100).format('0,0.00');
        $scope.price_color = $scope.change >= 0.0 ? {"color":"limegreen"} : {"color":"red"};
        $scope.priceArrow = $scope.change >= 0.0 ? "public/images/arrow_up.svg":"public/images/arrow_drop.svg"
        var num_format = $scope.price >= 0.5 ? '0,0.00':'0,0.0000';
        num_format = dataSrv.getCurrency() == "BTC" ? '0,0.00000000' : num_format;
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
		    url : "https://min-api.cryptocompare.com/data/histominute?fsym="+$scope.coin_data.Symbol+"&tsym="+dataSrv.getCurrency()+"&limit=2&aggregate=15"
		}).then(function(response) {
			return response.data;

		})
    }
   

   var loadPriceData = function(){
   		cc = $scope.selectedC.timeSize*conversions[$scope.selectedC.timeUnit];
   		dd = $scope.selectedZ.timeSize*conversions[$scope.selectedZ.timeUnit];

		$http({
		    method : "GET",
		    url : "https://min-api.cryptocompare.com/data/histo"+$scope.selectedC.timeUnit+"?fsym="+$scope.coin_data.Symbol+"&tsym="+dataSrv.getCurrency()+"&limit="+(dd/cc)+"&aggregate="+$scope.selectedC.timeSize
		})
		.then(function(res){
		    chartData = res.data.Data;
		    for (var i = 0; i < chartData.length; i++) {
		    	chartData[i].time = chartData[i].time*1000;
		    }

		    chart.dataSets[0].dataProvider = chartData;
		    
			chart.categoryAxesSettings.minPeriod = $scope.selectedC.periods[0];
		    chart.categoryAxesSettings.groupToPeriods = $scope.selectedChart == 'line' ? [$scope.selectedC.periods[0]] : $scope.selectedC.periods;
		    if (chart.dataSets[0].dataProvider.length < 365 == false) {
		    	chart.panels[0].hideGraph(chart.panels[0].stockGraphs[2]);
		    	chart.panels[0].hideGraph(chart.panels[0].stockGraphs[3]);
      			AmCharts.addMovingAverage(chart.dataSets[0], chart.panels[0], "close");
      		}
		    
		   		chart.validateData();   	
		   	chart.zoom(new Date(chart.dataSets[0].dataProvider[Math.ceil(chart.dataSets[0].dataProvider.length/2)-1].time),new Date());
		   	
		},function(err){
			console.log(err)
		})
	}


	var getCoinSnapshot = function(){
		$http({
		    method : "GET",
		    url : "https://min-api.cryptocompare.com/data/top/exchanges/full?fsym="+$scope.coin_data.Symbol+"&tsym="+dataSrv.getCurrency()
		}).then(function(response){
			$scope.coin_supply_int = response.data.Data.CoinInfo.TotalCoinsMined;
			$scope.coin_supply = numeral($scope.coin_supply_int).format('0,0');
		})
	};

	$scope.changeZoom = function(newZoom){
		if ($scope.selectedZ != newZoom) {
			var curtain = document.getElementById("curtain");
			curtain.style.visibility = "visible";
			var backgroundcurtain = document.getElementById("backgroundcurtain");
      		backgroundcurtain.style.visibility = "visible";
			$scope.selectedZ = newZoom;
			loadPriceData();
		}
	};

	$scope.changeCandle = function(newCandle){
		if ($scope.selectedC != newCandle) {
			chart.panels[0].stockGraphs[0].type = $scope.selectedChart;
			var curtain = document.getElementById("curtain");
			curtain.style.visibility = "visible";

			var backgroundcurtain = document.getElementById("backgroundcurtain");
      		backgroundcurtain.style.visibility = "visible";
			$scope.selectedC = newCandle;
			loadPriceData();
		}
	};

	$scope.changeChartType = function(chart_type){
		var curtain = document.getElementById("curtain");
		curtain.style.visibility = "visible";

		var backgroundcurtain = document.getElementById("backgroundcurtain");
      	backgroundcurtain.style.visibility = "visible";
		$scope.selectedChart = chart_type;
		
		
		if ($scope.selectedChart == 'line') {
			chart.categoryAxesSettings.minPeriod = $scope.selectedC.periods[0];
			chart.categoryAxesSettings.groupToPeriods = [$scope.selectedC.periods[0]];
			chart.panels[0].showGraph(chart.panels[0].stockGraphs[0]);
			chart.panels[0].hideGraph(chart.panels[0].stockGraphs[1]);
		}
		else{
			chart.categoryAxesSettings.minPeriod = $scope.selectedC.periods[0];
			chart.categoryAxesSettings.groupToPeriods = $scope.selectedC.periods;
			chart.panels[0].showGraph(chart.panels[0].stockGraphs[1]);	
			chart.panels[0].hideGraph(chart.panels[0].stockGraphs[0]);
		}
		
		chart.validateData();


	}

	$scope.addMovingAverage = function(parameter){
		if (chart.dataSets[0].dataProvider.length < 365) {
			return;
		}

		$scope.movingAverage = parameter == '50' ? !$scope.movingAverage : $scope.movingAverage;
		$scope.movingAverage200 = parameter == '200' ? !$scope.movingAverage200 : $scope.movingAverage200;

		if ($scope.movingAverage && parameter == '50') {
			chart.panels[0].showGraph(chart.panels[0].stockGraphs[2]);
		}
		else if(parameter == '50'){
			chart.panels[0].hideGraph(chart.panels[0].stockGraphs[2]);
		}

		if ($scope.movingAverage200 && parameter == '200') {
			chart.panels[0].showGraph(chart.panels[0].stockGraphs[3]);
		}
		else if(parameter == '200'){
			chart.panels[0].hideGraph(chart.panels[0].stockGraphs[3]);
		}


	}

	$scope.$on('$destroy', function() {
	  tickerSrv.unsub($scope.coin_data.Symbol, panelCall);
	})

	$timeout(function(){


   $http({
    method : "GET",
    url : "https://min-api.cryptocompare.com/data/histoday?fsym="+$scope.coin_data.Symbol+"&tsym="+dataSrv.getCurrency()+"&limit=365"
	}).then(function(response) {

     chartData = response.data.Data;
     for (var i = 0; i < chartData.length; i++) {
     	chartData[i].time = chartData[i].time*1000;
     }

   
     var chartconf = {
  "type": "stock",
  "theme": chartTheme,
  "balloon": {
   
    "cornerRadius": 6
  },
   "processTimeout": "250",
   "zoomEnabled": true,
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
      "startDuration": 0,

      "categoryAxis": {
        "dashLength": 5
      },

      "stockGraphs": [ {
        "type": "line",
        "id": "g1",
        "valueField": "close",
        "lineColor": "#7f8da9",
        "fillColors": "#7f8da9",
        "fillAlphas": 0.1,
        "useDataSetColors": false,
        "comparable": true,
        "compareField": "close",
        "showBalloon": true,
        "balloonText": "Close:<b>[[close]]</b><br>",
        "hidden": false,
         "balloonFunction": function(item, graph) {
      var result = graph.balloonText;

      for (var key in item.dataContext) {
        if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
          var formatted = AmCharts.formatNumber(item.dataContext[key], {
            precision: 8,
            decimalSeparator: ".",
            thousandsSeparator: ","
          }, numbertoround);
          result = result.replace("[[" + key + "]]",formatted);
        }
      }
      return result;
    }
      },
		{
		"type": "candlestick",
        "id": "g2",
        "openField": "open",
        "closeField": "close",
        "highField": "high",
        "lowField": "low",
        "valueField": "close",
        "lineColor": "#7f8da9",
        "fillColors": "#7f8da9",
        "negativeLineColor": "#db4c3c",
        "negativeFillColors": "#db4c3c",
        "fillAlphas": 0.8,
        "useDataSetColors": false,
        "comparable": true,
        "compareField": "value",
        "showBalloon": true,
        "proCandlesticks": true,
        "hidden": true,
        "balloonFunction": function(item, graph) {
       
      return "Open:<b>"+item.dataContext["openOpen"]+"</b><br>Low:<b>"+item.dataContext["lowLow"]+"</b><br>High:<b>"+item.dataContext["highHigh"]+"</b><br>Close:<b>"+item.dataContext["closeClose"]+"</b><br>";
    }
         		}
      ,
      {
        "type": "line",
        "id": "g3",
        "valueField": "avg1",
        "lineColor": "#7f8da9",
        "fillAlphas": 0,
        "useDataSetColors": false,
        "comparable": true,
        "compareField": "avg1",
        "showBalloon": true,
        "balloonText": "",
        "hidden": !$scope.movingAverage,
        "periodValue": "Average",
         "balloonFunction": function(item, graph) {
         	if (!$scope.movingAverage) {
         		return" "
         	}
      return "MA70: <b>"+item.dataContext[$scope.selectedChart == 'candlestick' ? "avg1Average":"avg1"].toFixed(roundCurrency[dataSrv.getCurrency()])+"<b>";
    }},
      {
        "type": "line",
        "id": "g4",
        "valueField": "avg2",
        "lineColor": "#ff9100",
        "fillAlphas": 0,
        "useDataSetColors": false,
        "comparable": true,
        "compareField": "avg2",
        "showBalloon": true,
        "balloonText": "",
        "hidden": !$scope.movingAverage200,
        "periodValue": "Average",
         "balloonFunction": function(item, graph) {
         	if (!$scope.movingAverage200) {
         		return " ";
         	}
      return "MA200: <b>"+item.dataContext[$scope.selectedChart == 'candlestick' ? "avg2Average":"avg2"].toFixed(roundCurrency[dataSrv.getCurrency()])+"<b>";
    }
      }
      ],

      "stockLegend": {
        "markerType": "none",
        "markerSize": 0,
        "labelText": "",
        "valueText": ""
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
        "fillAlphas": 0.8
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
    "position": "top",
    "height": 34,
    "enabled": false
  },

  "valueAxesSettings": {
    "inside": true,
    "showFirstLabel": false
  },

  "chartCursorSettings": {
    "valueLineEnabled": false,
    "fullWidth": true,
    "cursorAlpha": 0.1,
    "valueBalloonsEnabled": true
  },
  "export": {
    "enabled": false
  },
  "panelsSettings":{
  	"marginLeft": 0,
  	"marginRight": 0
  },
  "listeners": [{
    "event": "rendered",
    "method": function(e) {
      var curtain = document.getElementById("curtain");
      	curtain.style.visibility = "hidden";

      	var backgroundcurtain = document.getElementById("backgroundcurtain");
      	backgroundcurtain.style.visibility = "hidden";
    }
  },{
  	"event": "dataUpdated",
  	"method": function(e) {
      var curtain = document.getElementById("curtain");
      	curtain.style.visibility = "hidden";

      	var backgroundcurtain = document.getElementById("backgroundcurtain");
      	backgroundcurtain.style.visibility = "hidden";
      	$scope.movingAverage = chart.dataSets[0].dataProvider.length < 365 ? false : $scope.movingAverage;
      	$scope.movingAverage200 = chart.dataSets[0].dataProvider.length < 365 ? false : $scope.movingAverage200;
      	$scope.$apply()

    }
  }]
} 


	AmCharts.addMovingAverage(chartconf.dataSets[0], chartconf.panels[0], "close");
    chart = AmCharts.makeChart( "chartdiv",chartconf );
	chart.categoryAxesSettings.minPeriod = $scope.selectedC.periods[0];
    chart.categoryAxesSettings.groupToPeriods = [$scope.selectedC.periods[0]];
    n = response.data.Data.length;
    oldprice = (response.data.Data[n-1].open);
    tickerSrv.subscribe($stateParams.coin_data.Symbol, panelCall);


  chart.addListener( "zoomed", function( event ) {
  	  var data = chart.dataSets[ 0 ].dataProvider;
	  if ( ( event.startDate.getTime() > new Date(chartData[0].time).getTime() ) || ( event.endDate.getTime() < new Date(chartData[chartData.length-1].time) ) ) {
	    document.getElementById( "zoomout" ).style.visibility =  "visible";
	    a = 1 + 1;
	  } 
	  else {
	    document.getElementById( "zoomout" ).style.visibility = "hidden";
	    a = 1 + 1;
	  }
	} );

	$scope.isLoading = false;
    }, function (err) {
      console.log(err);
  });
},200)
	$scope.zoomOut = function(){
		var curtain = document.getElementById("zoomout");
      	zoomout.style.visibility = "hidden";
		chart.zoomOut();
	}
	$scope.currency = dataSrv.getCurrency();
	getCoinSnapshot();
}
});