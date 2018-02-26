app.component('news',{
    controller: function($scope, $http, tickerSrv){
        $scope.page = 1;
        $scope.isbusy = true;
  
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
},
templateUrl: '/public/templates/coinNews.html'

});
