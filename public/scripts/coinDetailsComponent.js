app.component('coinDetails',{
    bindings: { coin_data: '<'},
templateUrl: '/public/templates/coinDetails.html',
controller: function ($scope, $stateParams, $http, tickerSrv, $timeout) {

	function timeConverter(UNIX_timestamp){
	      var a = new Date(UNIX_timestamp * 1000);
	      var year = a.getFullYear();
	      var month = a.getMonth()+1 < 10 ? '0'+(a.getMonth()+1) : a.getMonth()+1;
	      var date = a.getDate();
	      var time = year + "-" + month + '-' + date;
	      return time;
	}

	$scope.isLoading = true;
    $scope.coin_data = $stateParams.coin_data;

   $http({
    method : "GET",
    url : "https://min-api.cryptocompare.com/data/histoday?fsym="+$stateParams.coin_data.Symbol+"&tsym=USD&limit=180"
  }).then(function(response) {
     chartData = response.data.Data;
     for (var i = 0; i < chartData.length; i++) {
     	chartData[i].time = timeConverter(chartData[i].time);
     }

     n = response.data.Data.length;
     oldprice = (response.data.Data[n-1].open);

     var panelCall =  function (data) {
           $scope.price = data.PRICE;

            temp = ($scope.price / oldprice) > 1 ? ($scope.price / oldprice) - 1 : -1*(1 - ($scope.price / oldprice));
            $scope.change = (Math.round(((Math.round(temp*1000)/1000)*100)*100)/100);
            $scope.price_color = $scope.change >= 0.0 ? {"color":"green","display":"inline-block"} : {"color":"red"};
            $scope.change += "%"
            $scope.price += " USD"
     }

    var chart = AmCharts.makeChart( "chartdiv", {
	  "type": "serial",
	  "theme": "dark",
	  "dataDateFormat":"YYYY-MM-DD",
	  "valueAxes": [ {
	    "position": "left"
	  } ],
	  "graphs": [ {
	    "id": "g1",
	    "balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
	    "closeField": "close",
	    "fillColors": "green",
	    "highField": "high",
	    "lineColor": "green",
	    "lineAlpha": 1,
	    "lowField": "low",
	    "fillAlphas": 0.9,
	    "negativeFillColors": "#db4c3c",
	    "negativeLineColor": "#db4c3c",
	    "openField": "open",
	    "title": "Price:",
	    "type": "candlestick",
	    "valueField": "close"
	  } ],
	  "chartScrollbar": {
	    "graph": "g1",
	    "graphType": "line",
	    "scrollbarHeight": 30
	  },
	  "chartCursor": {
	    "valueLineEnabled": false,
	    "valueLineBalloonEnabled": false
	  },
	  "categoryField": "time",
	  "categoryAxis": {
	    "parseDates": true
	  },
	  "dataProvider": chartData,

	  "export": {
	    "enabled": false
	  }
	} );

	
	chart.zoomToIndexes( chart.dataProvider.length - 30, chart.dataProvider.length - 1 );
    tickerSrv.subscribe($stateParams.coin_data.Symbol, panelCall);
    $timeout(function() { $scope.isLoading = false;}, 400);

    }, function myError(response) {
      console.log(response);
  });
}
});