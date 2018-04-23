var chartConfig = {
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
					"dataProvider": null,
					"export": {
					   "enabled": false
					}
				}


var timeConverter = function(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var year = a.getFullYear();
      var month = a.getMonth()+1 < 10 ? '0'+(a.getMonth()+1) : a.getMonth()+1;
      var date = a.getDate();
      var time = year + '-' + month + '-' + date;
      return time;
	}