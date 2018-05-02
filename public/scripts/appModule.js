var app = angular.module("coinTicker", ['ngMaterial','infinite-scroll','ui.router','ngAnimate','ngMessages','ngImgCrop','ngFileUpload']);
app.value('THROTTLE_MILLISECONDS', 2000);


app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdInkRippleProvider,$mdProgressCircularProvider) {

  $mdProgressCircularProvider.configure({
    progressSize: 50,
    duration: 400
  });

  // disable ripple UI effect globally
  //$mdInkRippleProvider.disableInkRipple();

  // registering default theme
  $mdThemingProvider
    .theme('default')
    .primaryPalette('green')
    .accentPalette('purple')

    $mdThemingProvider
    .theme('dark-default')
    .primaryPalette('green')
    .accentPalette('purple').dark()

  // initialize ui-router states
  var profileState = {
    name: 'profile',
    url: '/profile',
    component: 'profile'
  }


  var loginState = {
    name: 'login',
    url: '/login',
    component: 'login'
  }

  var signedInState = {
    name: 'signedin',
    url: '/user/{userId}',
    component: 'userDetails',
    resolve: {
      userStatus: function(userSrv){
        return userSrv.authenticated({username: true, avatarImage: true});
      }
    }
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

  var dexState = {
    name: 'dex',
    url: '/dexchange',
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
    url: '/{coinName}',
    component:'coinDetails',
    params:{
      coin_data: null
    }
  }

  $stateProvider.state(signedInState);
  $stateProvider.state(dexState);
  $stateProvider.state(loginState);
  $stateProvider.state(coinDetailsState);
  $stateProvider.state(profileState);
  $stateProvider.state(aboutState);
  $stateProvider.state(newsState);
  $stateProvider.state(coinListState);
  $stateProvider.state(readArticleState);
  $urlRouterProvider.otherwise('/');

});

app.directive('userMenu',function(){
  return {
    template: '\
    <md-menu>\
          <span aria-label="Open demo menu" ng-click="$mdMenu.open($event)">\
            drek\
          </span>\
          <md-menu-content width="3">\
            <md-menu-item ng-repeat="item in [1, 2, 3]">\
              <md-button> <span md-menu-align-target>Option</span> {{item}} </md-button>\
            </md-menu-item>\
          </md-menu-content>\
        </md-menu>'
  }
})


app.directive('sl', function(){
  function link(scope, el, attr){
    el = d3.select(el[0]);
    var svg = el;

    scope.getSparklineData(scope.item).then(function(data){
    var min = attr.min !== undefined ? +attr.min : d3.min(data);
    var max = attr.max !== undefined ? +attr.max : d3.max(data);
    el.text(''); // remove the original data text
    var r = attr.r || 0;
    var m = r;
    var w = svg.node().clientWidth;
    var h = +getComputedStyle(el.node())['font-size'].replace('px','');
    svg.attr({width: w, height: h});
    var x = d3.scale.linear().domain([0, data.length - 1]).range([m, w - m]);
    var y = d3.scale.linear().domain([min, max]).range([h - m, m]);
    var lines = svg.append('path').data(data)
      .attr('d', 'M' + data.map(function(d, i){ return [x(i),y(d)] }).join('L'));
    var circles = svg.selectAll('circle').data(data).enter().append('circle')
      .attr('r', r)
      .attr('cx', function(d, i){ return x(i) })
      .attr('cy', function(d){ return y(d) });


    })
  }
  return {
      link: link
    , restrict: 'E'
    , replace: true
    , template: '<svg ng-transclude class="sl"></svg>'
    , transclude: true
  };
});
