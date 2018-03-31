app.component("coinlist", {
controller:
    function($scope, $http, $interval, tickerSrv,$state,$mdUtil,$window) {
        var skip = 0;
        $scope.isbusy = false;
        $mdUtil.enableScrolling();
        $http.get("coinlist?b="+skip)
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

        $scope.loadMore = function(){
            if ($scope.isbusy) {return;}
            $scope.isbusy = true;
            skip += 10;
            console.log('firing'+skip)
            $http.get("coinlist?b="+skip)
                .then(function(response) {
                    $scope.coins = $scope.coins.slice(0).concat(response.data);
                    $scope.isbusy = false;
                }); 
        }

        $scope.scrollTop = function(){
            $window.scrollTo(0, 0);
        }

}, templateUrl: '/public/templates/coinList.html'})