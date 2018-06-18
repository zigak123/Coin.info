var chartConfig = {
				"type": "stock",
				"theme": chartTheme,
				"startDuration": 0.0,
				"fontFamily": "Roboto",
				"categoryAxis": {
					"parseDates": true
				},
				 "dataDateFormat": "YYYY-MM-DD",
				"dataSets": [ {
				    "title": "data set",
				    "fieldMappings": [ {
				      "fromField": "value",
				      "toField": "value"
				    }, {
				      "fromField": "volumeto",
				      "toField": "volumeto"
				    }, {
				      "fromField": "volumefrom",
				      "toField": "volumefrom"
				    }
				    , {
				      "fromField": "open",
				      "toField": "open"
				    }, {
				      "fromField": "close",
				      "toField": "close"
				    }, {
				      "fromField": "low",
				      "toField": "low"
				    }, {
				      "fromField": "high",
				      "toField": "high"
				    }   ],
				    "dataProvider": [{"low": 100,"high":200,"open":220,"close":245,"volumeto":889,"volumefrom":422,"time":"2018-03-22"},{"low": 100,"high":288,"open":160,"close":205,"volumeto":589,"volumefrom":481,"time":"2018-03-23"}],
				    "categoryField": "time",
				} ],
				"panels": [ {

				      "showCategoryAxis": false,
				      "title": "Value",
				      "percentHeight": 70,
				      "stockGraphs": [ {
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
				
				      } ]
				    },

				    {
				      "title": "Volume",
				      "percentHeight": 30,
				      "stockGraphs": [ {
				        "valueField": "volume",
				        "type": "column",
				        "showBalloon": false,
				        "fillAlphas": 1
				      } ]
				    }
				  ]
			}

	   var chart = AmCharts.makeChart("chartdiv", chartConfig);