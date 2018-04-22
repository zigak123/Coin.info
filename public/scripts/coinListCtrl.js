app.component("coinlist", {

controller:
    function($scope, $http, $interval, tickerSrv,$state,$window, scrollSrv) {
        var skip = 0;
       // $scope.isbusy = true;
        $scope.showFAB = false;
        $scope.coins = [];
/*
        $http.get("coinlist?b="+skip)
        .then(function(response) {
            $scope.coins = response.data
            $scope.isbusy = false;
        });  
*/

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
            //else if (skip>=100) {$scope.isbusy = true; return;}
            $scope.isbusy = true;
            $http.get("coinlist?b="+skip)
                .then(function(response) {
                    //$scope.coins = $scope.coins.concat(response.data);
                    /*
                    for (var i = 0; i < response.data.length; i++) {
                        
                        $scope.coins.push(response.data[i])
                    }
                    */
                    [].push.apply($scope.coins,response.data);
                    $scope.isbusy = false;
                    //$scope.$apply();
                }); 
             skip += 10;
        }
        
        $scope.scrollTop = function(){
            $window.scrollTo(0, 0);
        }
        /*
        scrollSrv.on($scope);
        $scope.$on('$destroy', function() {
            scrollSrv.off();
        })
        */

}, templateUrl: '/public/templates/coinList.html'})