app.component("coinlist", {

controller:
    function($scope, $http, tickerSrv,$state, scrollSrv, $timeout, $q, $interval,$mdMedia,dataSrv) {
        //var skip = 0;
        $scope.showFAB = false;
        $scope.coins = [];
        var marketTicker;


        var getMarketData = function(){ $http({
                method : "GET",
                url : "https://api.coinmarketcap.com/v2/global/"
                }).then(function(response) {
                 $scope.marketData = response.data.data;
                 $scope.marketData.quotes.USD.total_market_cap = numeral(response.data.data.quotes.USD.total_market_cap).format('0,0');
                 $scope.marketData.quotes.USD.total_volume_24h = numeral(response.data.data.quotes.USD.total_volume_24h).format('0,0');

            },function(err){
                console.log(err);
            })
        }

        $scope.searchText = function(query){
           return $http.get("search?text="+query)
                .then(function(response) {
                    return response.data;
                }); 
        }

        $scope.showDetails = function(item){
            $state.go('coinDetails', {coin_data: item, coinName: item.FullName})
        }

        $scope.loadMore = function(){
            if ($scope.isbusy) {return;}
            $scope.isbusy = true;
            
                 dataSrv.getCoins(function(result_data){
                 $scope.coins = result_data;
                 $scope.isbusy = false;

                 //skip += 10;
            }) 
          
        }

        $scope.$on("$destroy",function(event){
            $interval.cancel(marketTicker);
        })


        // start global market ticker(1min repeat api update)
        getMarketData();
        marketTicker = $interval(getMarketData, 60000);


}, templateUrl: '/public/templates/coinList.html'})