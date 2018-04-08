app.component('news',{
    controller: function($scope, $http, tickerSrv, $window, scrollSrv){
        $scope.page = 1;
        $scope.isbusy = true;
        $scope.showFAB = false;
  
       $http.get('news').then(function(res){
        $scope.articles = res.data.articles;
        $scope.isbusy = false;
    });


    $scope.LoadArticles = function(){
        $scope.isbusy = true;
        $scope.page += 1;

        $http.get('news?page='+$scope.page).then(function(res){
        $scope.articles = $scope.articles.concat(res.data.articles);
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
},
templateUrl: '/public/templates/coinNews.html'

});
