var app = angular.module("coinTicker", ['ngMaterial','infinite-scroll','ui.router']).value('THROTTLE_MILLISECONDS', 1200);

app.directive("scroll", function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function(e) {
      console.log(e);
      console.log(element)
      console.log(this.pageYOffset);
      scope.$apply();
    });
  };
});

app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdInkRippleProvider) {
  // disable ripple UI effect globally
  $mdInkRippleProvider.disableInkRipple();

  $mdThemingProvider
    .theme('default')
    .primaryPalette('green')
    .accentPalette('purple').dark()


  var profileState = {
    name: 'profile',
    url: '/profile',
    templateUrl: '/public/templates/profile.html'
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