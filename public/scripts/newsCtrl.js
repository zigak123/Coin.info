app.component('news',{
    controller: function($scope, $http, tickerSrv, $window, scrollSrv){
        $scope.showFAB = false;
        $scope.isbusy = true;
        $scope.page = 1;
  
       $http.get('news').then(function(res){
        $scope.articles = res.data.articles;
        $scope.isbusy = false;
    });


    $scope.LoadArticles = function(){
        if ($scope.isbusy) {return;}
        $scope.isbusy = true;
        $scope.page += 1;

        $http.get('news?page='+$scope.page).then(function(res){
        //$scope.articles = $scope.articles.concat(res.data.articles);
        [].push.apply($scope.articles,res.data.articles);
        $scope.isbusy = false;
    });   
    }

    $scope.scrollTop = function(){
        $scope.showFAB = false;
        $window.scrollTo(0, 0);
    }

    scrollSrv.on($scope);
    $scope.$on('$destroy', function() {
        scrollSrv.off();
    })
    
},
templateUrl: '/public/templates/coinNews.html'

});
