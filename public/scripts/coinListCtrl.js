app.component("coinlist", {

controller:
    function($scope, $http, tickerSrv,$state, scrollSrv, $timeout, $q) {
        var skip = 0;
        $scope.showFAB = false;
        $scope.coins = [];

        $scope.searchText = function(query){
           return $http.get("search?text="+query)
                .then(function(response) {
                    return response.data;
                }); 
        }

        $scope.getSparklineData = function(coin){
            return $http({
                method : "GET",
                url : "https://min-api.cryptocompare.com/data/histoday?fsym="+coin.Symbol+"&tsym=USD&limit=30"
                }).then(function(response) {
                 return response.data.Data.map(a => a.close);
            },function(err){
                return err;
            })
        }

        $scope.showDetails = function(item){
            $state.go('coinDetails', {coin_data: item, coinName: item.FullName})
        }

        $scope.loadMore = function(){
            if ($scope.isbusy) {return;}
            else if (skip>0) {$scope.isbusy = true; return;}
            $scope.isbusy = true;
            $http.get("coinlist?skip="+skip)
                .then(function(response) {
                    var promises = [];
                
                    angular.forEach(response.data, function(key){
                        var promise = $scope.getSparklineData(key).then(function(responseData){
                            key['lineData'] = responseData;     
                        })   
                        promises.push(promise);
                    });

                    $q.all(promises).then(function(){
                       $timeout(function(){
                            [].push.apply($scope.coins,response.data);
                            $scope.isbusy = false; 
                        },450);
                    });
                    
                    
                    
                   
                }); 
             skip += 10;
        }
   

}, templateUrl: '/public/templates/coinList.html'})