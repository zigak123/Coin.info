app.component('news',{
    controller: ["$scope", "$http", "scrollSrv", "$state", "userSrv", "$rootScope", "$timeout","$mdMedia","$location","$anchorScroll", function($scope, $http, scrollSrv, $state, userSrv, $rootScope, $timeout,$mdMedia,$location,$anchorScroll){
        $scope.showFAB = false;
        $scope.isbusy = true;
        $scope.page = 1;
        $scope.favoriteIcon = "public/images/ic_favorite_border_black_24px.svg";
        $scope.articles = [];
        $scope.isSmall = $mdMedia('xs');

        $scope.$watch(function(){
            return $mdMedia('xs');
        }, function(arg){
            $scope.isSmall = arg;
        })

       userSrv.authenticated({articles: true}).then(function(res){
            $scope.likedArticlesDict = {};
            for (var i =  0; i < res.length; i++) {
                $scope.likedArticlesDict[res[i]] = true;
            }
       }, function(err){

       })

    $scope.LoadArticles = function(){
        $scope.isbusy = true;
        

        $http.get('news?page='+$scope.page).then(function(res){
            
            if (res.data !== undefined && res.data !== null) {
                angular.forEach(res.data, function(key){
                    var dateFuture = new Date();
                    var dateNow = new Date(key.publishedAt);
                    dateNow = dateNow - 3600000;

                    var seconds = Math.floor((dateFuture - (dateNow))/1000);
                    var minutes = Math.floor(seconds/60);
                    var hours = Math.floor(minutes/60);
                    var days = Math.floor(hours/24);

                    hours = hours-(days*24);
                    minutes = minutes-(days*24*60)-(hours*60);
                    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

                    minutes = minutes > 0 ? minutes+' min ' : '';
                    hours = hours > 0 ? hours+' h ' : '';
                    days = days > 0 ? days+' d ' : '';

                    key.publishedAt = (days+hours+minutes);
                });

                [].push.apply($scope.articles, res.data);
            }
            else{
                var err = new Error('bad response from newsAPI: '+res.data.message);
                throw err;
            }
    }).then(function(){
        $scope.isbusy = false;
        $scope.page += 1;
    });   
    }

    $scope.scrollTop = function(){
        if (!$mdMedia('gt-xs')) {
            $('body, html, #pageContent').scrollTop(0);
        }
        else{
            $("#pageContent").animate({ scrollTop: 0 }, angular.element("#pageContent").scrollTop()*0.025);
        }      
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
        delete selected_article.image;

        if (selected_article.title in $scope.likedArticlesDict) {
            reqUrl = '/delete';
            delete $scope.likedArticlesDict[selected_article.title];
        }
        else{
            reqUrl = '/save';
            $scope.likedArticlesDict[selected_article.title] = true;
        }
        
        $http({method: 'POST',
                url: reqUrl,
                data: selected_article
            }).then(function(res){
                console.log('articles updated in mongoDB');
            })
    }

    var scrollFunc = function(){
        if (angular.element("#pageContent").scrollTop() > 0) {
            $scope.showFAB = true;
            $scope.$apply();
        }

        else if (angular.element("#pageContent").scrollTop() == 0) {
            $scope.showFAB = false;
            $scope.$apply();
        }
    }

    $scope.$on('$destroy', function(){
        angular.element("#pageContent").off('scroll', scrollFunc);
    });
    
    angular.element("#pageContent").on('scroll', scrollFunc);
    $timeout(function(){$scope.LoadArticles(false)},350);
}],
templateUrl: '/public/templates/coinNews.html'});


