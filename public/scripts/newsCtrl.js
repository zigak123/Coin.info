app.component('news',{
    controller: function($scope, $http, tickerSrv, $window, scrollSrv,$state){
        $scope.showFAB = false;
        $scope.isbusy = true;
        $scope.page = 1;
        $scope.favoriteIcon = "public/images/ic_favorite_border_black_24px.svg";
  
       $http.get('news').then(function(res){
        $scope.articles = res.data.articles;
        $scope.isbusy = false;
    });


    $scope.LoadArticles = function(){
        if ($scope.isbusy) {return;}
        $scope.isbusy = true;
        $scope.page += 1;

        $http.get('news?page='+$scope.page).then(function(res){
        [].push.apply($scope.articles,res.data.articles);
        $scope.isbusy = false;
    });   
    }

    $scope.scrollTop = function(){
        $scope.showFAB = false;
        $window.scrollTo(0, 0);
    }

    $scope.readArticle = function(selected_article){
        $state.go('article',{articleName: selected_article.title, article: selected_article})
    }

    $scope.likeArticle = function(selected_article){
        console.log('liked');
        $scope.isLiked = {"fill": "#E91E63"};
        $scope.favoriteIcon = "public/images/ic_favorite_black_24px.svg";
        $http({
                method: 'POST',
                url: '/save',
                data: selected_article
            }).then(function(res){
                console.log(res)
            })
        console.log(selected_article)
    }

    scrollSrv.on($scope);
    $scope.$on('$destroy', function() {
        scrollSrv.off();
    })
    
},
templateUrl: '/public/templates/coinNews.html'

});
