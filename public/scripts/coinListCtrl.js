app.component("coinlist", {

controller:
    function($scope, $http, $interval, tickerSrv,$state,$window, scrollSrv) {
        var skip = 0;
        $scope.isbusy = false;
        $scope.showFAB = false;

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
            skip += 10;
            $http.get("coinlist?b="+skip)
                .then(function(response) {
                    $scope.coins = $scope.coins.concat(response.data);
                    $scope.isbusy = false;
                }); 
        }
        
        $scope.scrollTop = function(){
            $window.scrollTo(0, 0);
        }
        
        scrollSrv.on($scope);
        $scope.$on('$destroy', function() {
            scrollSrv.off();
        })

}, templateUrl: '/public/templates/coinList.html'})