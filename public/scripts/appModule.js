var app = angular.module("coinTicker", ['ngMaterial','infinite-scroll','ui.router','ngAnimate','ngMessages','ngImgCrop','ngFileUpload']);
app.value('THROTTLE_MILLISECONDS', 5000);


app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdInkRippleProvider,$mdProgressCircularProvider,$mdAriaProvider) {

  $mdProgressCircularProvider.configure({
    progressSize: 50
  });
  // disable aria label warnings
  $mdAriaProvider.disableWarnings();

  // registering default theme
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('pink')

    $mdThemingProvider
    .theme('darkDefault')
    .primaryPalette('blue')
    .accentPalette('purple').dark()

  $mdThemingProvider.alwaysWatchTheme(true);

   $mdThemingProvider.enableBrowserColor({
      theme: 'default', // Default is 'default'
      palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
      hue: '800' // Default is '800'
    });

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
  $stateProvider.state(loginState);
  $stateProvider.state(coinDetailsState);
  $stateProvider.state(profileState);
  $stateProvider.state(aboutState);
  $stateProvider.state(newsState);
  $stateProvider.state(coinListState);
  $stateProvider.state(readArticleState);
  $urlRouterProvider.otherwise('/');

});

app.directive('priceChangeLabel',function(){
  function link(scope, el, attr){
    n = scope.priceInfo.length;
    scope.temp = (scope.priceInfo[n-1] / scope.priceInfo[n-31]) > 1 ? (scope.priceInfo[n-1] / scope.priceInfo[n-31]) - 1 : -1*(1 - (scope.priceInfo[n-1] / scope.priceInfo[n-31]));
    scope.temp = numeral(scope.temp*100).format('0,0.00');

    if (scope.temp < 0) {
      scope.price_arrow = "public/images/arrow_drop.svg";
      scope.style = {"color": "red"};
    }

    else{
      scope.price_arrow = "public/images/arrow_up.svg";
      scope.style = {"color": "limegreen"};
    }
  }

  return {
    restrict: 'E',
    scope: {
        priceInfo: '=info'
    },
    template: '<div layout="row" align="end">\
                    <md-icon style="height: 24px; margin-left: 0px; margin-right: 0px" md-svg-src={{price_arrow}}></md-icon>\
                      <span class="md-caption" ng-style="style"> {{temp}} % </span>\
              </div>'
  ,
  link: link
  }
})

app.directive('sl', function($timeout,$window){
  function link(scope, el, attr){
    el = d3.select(el[0]);
    var svg = el;
    var data = scope.item['lineData'];
    var min = attr.min !== undefined ? +attr.min : d3.min(data);
    var max = attr.max !== undefined ? +attr.max : d3.max(data);
    el.text(''); // remove the original data text
    var r = attr.r || 0;
    var m = r;
    var w = svg.node().clientWidth;
    w = 64; // fixed width becasue of firefox width issues
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
  }
  return {
    link: link
    , restrict: 'E'
    , replace: true
    , template: '<svg ng-transclude class="sl"></svg>'
    , transclude: true
  };
});

app.directive('imageCheck', function($rootScope){

  function link(scope, el, attr){
    if (scope.article.image == null || jQuery.isEmptyObject(scope.article.image)) {
      scope.article.image = $rootScope.currentTheme == 'default' ? 'public/images/baseline_broken_image_black_48dp.png':'public/images/baseline_broken_image_white_48dp.png';
    }
    
    el.bind('error', function(){
      scope.article.image = $rootScope.currentTheme == 'default' ? 'public/images/baseline_broken_image_black_48dp.png':'public/images/baseline_broken_image_white_48dp.png';
    })

    el.bind('load', function(){
      el.removeClass('imageLoad');
    })

    $rootScope.$watch('currentTheme',function(){
      if (scope.article.image.split("/")[0] == 'public') {
          scope.article.image = $rootScope.currentTheme == 'default' ? 'public/images/baseline_broken_image_black_48dp.png':'public/images/baseline_broken_image_white_48dp.png';
      }
    })
  }

  return{
    scope: false,
    link: link,
  }
});

app.directive('titleClamp', function(){
  function link(scope, el, attr){
      $clamp(el[0], {clamp: 4, useNativeClamp: true});
  }
  return {
    link: link
  }
})

app.directive('userMenu', function(){
  return {
    templateUrl: 'public/templates/userMenu.template.html'
  }
})




