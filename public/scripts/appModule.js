var app = angular.module("coinTicker", ['ngMaterial','infinite-scroll','ui.router','ngAnimate']).value('THROTTLE_MILLISECONDS', 1500);
var scrollWatcher = null;


app.directive("scroll", function ($window, $state, $location) {


  var scrollFunction = function(scope, element, attrs) {
      
      angular.element($window).on("scroll", function(e) {
      if ($window.pageYOffset > 64 && scope.showFAB == false) {
        scope.showFAB = true;
        scope.$apply();
      }

      else if($window.pageYOffset == 0 && scope.showFAB == true){
        scope.showFAB = false;
        scope.$apply();
      }
    });
  };

  scrollWatcher = scrollFunction;

  return scrollFunction;
  






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