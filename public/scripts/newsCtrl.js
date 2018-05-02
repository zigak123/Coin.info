app.component('news',{
    controller: function($scope, $http, tickerSrv, $window, scrollSrv, $state, userSrv){
        $scope.showFAB = false;
        $scope.isbusy = true;
        $scope.page = 1;
        $scope.favoriteIcon = "public/images/ic_favorite_border_black_24px.svg";

  
       $http.get('news').then(function(res){
            $scope.articles = res.data.articles;
            $scope.isbusy = false;
       });

       userSrv.authenticated({articles: true}).then(function(res){
            $scope.likedArticlesDict = {};
            for (var i =  0; i < res.length; i++) {
                $scope.likedArticlesDict[res[i]] = true;
            }
            console.log($scope.likedArticlesDict);
       })

    $scope.LoadArticles = function(){
        $scope.isbusy = true;
        $scope.page += 1;

        $http.get('news?page='+$scope.page).then(function(res){
        [].push.apply($scope.articles, res.data.articles);
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

    $scope.setIcon = function(thatarticle){
        if ($scope.likedArticlesDict && $scope.likedArticlesDict[thatarticle.title]) {
            return 'public/images/ic_favorite_black_24px.svg';
        }
        return 'public/images/ic_favorite_border_black_24px.svg';
    }

    $scope.likeArticle = function(selected_article){
        if (!$scope.likedArticlesDict) {return;}
        var reqMethod;
        var reqUrl;

        if (selected_article.title in $scope.likedArticlesDict) {
            reqUrl = '/delete';
            delete $scope.likedArticlesDict[selected_article.title];
            //$scope.likedArticles.splice($scope.likedArticlesDict[selected_article.title),1);
        }
        else{
            reqUrl = '/save';
            $scope.likedArticlesDict[selected_article.title] = true;
            //$scope.likedArticles.push(selected_article.title);
        }
        

        $http({
                method: 'POST',
                url: reqUrl,
                data: selected_article
            }).then(function(res){
                console.log('articles updated in mongoDB')
            })
    }

    scrollSrv.on($scope);
    $scope.$on('$destroy', function() {
        scrollSrv.off();
    })
    
},
templateUrl: '/public/templates/coinNews.html'

});
