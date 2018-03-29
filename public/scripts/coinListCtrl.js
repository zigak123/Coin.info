app.component("coinlist", {
controller:
    function($scope, $http, $interval, tickerSrv,$state,$mdUtil) {
        var skip = 0;
        $scope.isbusy = true;
        $mdUtil.enableScrolling();
        $http.get("coinlist?b="+skip)
        .then(function(response) {
            $scope.coins = response.data
            $scope.isbusy = false;
        });  

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
            $scope.isbusy = true;
            skip += 15;
            $http.get("coinlist?b="+skip)
                .then(function(response) {
                    $scope.coins = $scope.coins.concat(response.data)
                    //console.log($scope.coins.length)
                    console.log(skip)
                    console.log($scope.coins[0])
                    $scope.isbusy = false;
                }); 
        }

}, templateUrl: '/public/templates/coinList.html'})