app.component('news',{
    controller: function($scope, $http, scrollSrv, $state, userSrv, $anchorScroll, $location, $rootScope){
        $scope.showFAB = false;
        $scope.isbusy = true;
        $scope.page = 1;
        $scope.favoriteIcon = "public/images/ic_favorite_border_black_24px.svg";

  
       $http.get('news').then(function(res){
            if (res.data.status === 'ok') {
                 angular.forEach(res.data.articles, function(key){
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

                 $scope.articles = res.data.articles;
                 $scope.isbusy = false;
            }
            else{
                var err = new Error('bad response from newsAPI: '+res.data.message)
                throw err;
            }
       });

       userSrv.authenticated({articles: true}).then(function(res){
            $scope.likedArticlesDict = {};
            for (var i =  0; i < res.length; i++) {
                $scope.likedArticlesDict[res[i]] = true;
            }
       })

    $scope.LoadArticles = function(){
        $scope.isbusy = true;
        $scope.page += 1;

        $http.get('news?page='+$scope.page).then(function(res){
            if (res.data.articles !== undefined && res.data.articles !== null) {
                angular.forEach(res.data.articles, function(key){
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
                [].push.apply($scope.articles, res.data.articles);
                $scope.isbusy = false;
            }
            else{
                var err = new Error('bad response from newsAPI: '+res.data.message);
                throw err;
            }
    });   
    }

    $scope.scrollTop = function(){
        $('html, body').animate({
        scrollTop: $("#pageTop").offset().top
    }, 2000);
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
        }
        else{
            reqUrl = '/save';
            $scope.likedArticlesDict[selected_article.title] = true;
        }
        

        $http({method: 'POST',
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
