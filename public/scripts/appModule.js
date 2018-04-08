var app = angular.module("coinTicker", ['ngMaterial','infinite-scroll','ui.router','ngAnimate']);
app.value('THROTTLE_MILLISECONDS', 1000);


app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdInkRippleProvider) {

  // disable ripple UI effect globally
  $mdInkRippleProvider.disableInkRipple();

  // registering default theme
  $mdThemingProvider
    .theme('default')
    .primaryPalette('green')
    .accentPalette('green')

  // initialize ui-router states
  var profileState = {
    name: 'profile',
    url: '/profile',
    component: 'profile',
    resolve: {
      testingthis: function(userSrv,$q){
        userSrv.authenticated();
        return $q.reject('not gonna happen');
      }
    }
  }


  var signUpState = {
    name: 'signup',
    url: '/signUp',
    component: 'profile'
  }

  var signedInState = {
    name: 'signedin',
    url: '/user/{userId}',
    component: 'profile'
  }


  var aboutState = {
    name: 'about',
    url: '/about',
    templateUrl: '/public/templates/about.html'
  }

  var newsState = {
    name: 'news',
    url: '/news',
    component: 'news'
  }

  var coinListState = {
    name: 'coinlist',
    url: '/',
    component: 'coinlist'
  }

  var readArticleState = {
    name: 'article',
    url: '/news/article/{articleName}',
    component:'article',
    params:{
      article: null
    }
  }

   var coinDetailsState = {
    name: 'coinDetails',
    url: '/coinDetails/{coinName}',
    component:'coinDetails',
    params:{
      coin_data: null
    }
  }

  $stateProvider.state(coinDetailsState);
  $stateProvider.state(profileState);
  $stateProvider.state(aboutState);
  $stateProvider.state(newsState);
  $stateProvider.state(coinListState);
  $stateProvider.state(readArticleState);
  $urlRouterProvider.otherwise('/');

});