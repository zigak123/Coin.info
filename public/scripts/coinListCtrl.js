app.component("coinlist", {
controller:
    function($scope, $http, $interval, tickerSrv,$state,$mdUtil) {
        $mdUtil.enableScrolling();
        $http.get("coinlist")
        .then(function(response) {
            $scope.coins = response.data
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

        

}, templateUrl: '/public/templates/coinList.html'})