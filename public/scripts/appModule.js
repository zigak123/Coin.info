var app = angular.module("coinTicker", ['ngMaterial','infinite-scroll','ui.router']).value('THROTTLE_MILLISECONDS', 1000);

app.directive("scroll", function ($window, $state) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function(e) {
      if ($state.current.name === "coinlist") {
      console.log(this.pageYOffset);
      //console.log($state.current)
      scope.$apply(function(drek){
        console.log(drek)
      });
      }
    });
  };
});

app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdInkRippleProvider) {

  // disable ripple UI effect globally
  $mdInkRippleProvider.disableInkRipple();

  // registering default theme
  $mdThemingProvider
    .theme('default')
    .primaryPalette('green')
    .accentPalette('purple').dark()

  // initialize ui-router states
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