app.controller('priceTickerCtrl', function($scope, tickerSrv, $state, $transitions, userSrv, $http,$rootScope,$mdSidenav,$log,$timeout,$mdMedia,$location) {
	var up = "public/images/arrow_up.svg"
	var drop = "public/images/arrow_drop.svg"
	var same = "public/images/minus.svg"
	var userStatus;
	$rootScope.currentTheme = 'default';
	var previous = $scope.selectedItem;
	themes = [{icon: "/public/images/moon.svg", label:"Dark Theme"},{icon: "/public/images/ic_wb_sunny_black_24px.svg", label:"Light Theme"}]
	
	$transitions.onSuccess({}, function(transition) {

		userStatus = userSrv.authenticated({username: true, avatarImage: true, theme: true}).then(function(res){
				$scope.tabName = res[0].username;
				$scope.imgSrc = String.fromCharCode.apply(null, res[0].avatarImage.data);
				$rootScope.currentTheme = res[0].theme;
				$scope.themeStuff = $rootScope.currentTheme === 'default' ? themes[0] : themes[1];
			
		}, function(err){
			$scope.tabName = "SIGN IN";
			$scope.imgSrc = "/public/images/ic_account_circle_white_36pt.png";
		});
		
		$scope.selectedItem = transition.to().name;
		previous = $scope.selectedItem;
	});

	$transitions.onBefore({},function(transition){
		var topHeaderHeight = angular.element('#pageTop')[0].clientHeight;
		var mobileTopHeight = angular.element('.md-nav-bar')[0].clientHeight;
		var footerHeight = angular.element('#footer').height()
		var height_offset = footerHeight + mobileTopHeight + topHeaderHeight;

		if (transition.to().name === 'news' || transition.to().name === 'coinlist' || transition.to().name === 'coinDetails') {
			height_offset -= footerHeight;
		}

		angular.element('#pageContent').css('min-height','calc(100% - '+height_offset+'px)');
	})


	$scope.screenSize;
	$scope.isSmall = function(){
		$scope.screenSize = $mdMedia('xs');
		return $mdMedia('xs');
	}

	$scope.profileClick = function(mdMenu){
		if ($scope.tabName != "SIGN IN") {
			mdMenu.open();
		}
		else{
			$state.go('login');
		}
	}

	$scope.changeTheme = function(){
		$rootScope.currentTheme = $rootScope.currentTheme === 'default' ? 'darkDefault':'default';
		$scope.themeStuff = $rootScope.currentTheme === 'default' ? themes[0] : themes[1];
		$http({
		    method: 'POST',
		    url: '/theme',
		    data: {theme: $rootScope.currentTheme}
		});
	}

	$scope.signOut = function(){
		$http({
		    method: 'POST',
		    url: '/user',
		    data: {signout: true}
		}).then(function(res){
		    	$state.go('login');
		    })
	}

	 $scope.close = function (stateToGo) {
      $mdSidenav('left').close()
        .then(function () {
            if(stateToGo === 'user' && $scope.tabName !== 'SIGN IN'){
	        	$state.go('signedin',{userId: $scope.tabName});
	        }
	        else{
	        	$state.go(stateToGo);
	        }
        });
    };

   function buildToggler(navID) {
	  return function() {
	    $mdSidenav(navID)
	      .toggle()
	      .then(function () {
	        $log.debug("toggle " + navID + " is done");
	      });
  		};
    }

    $scope.toggleLeft = buildToggler('left');
    $scope.isOpenLeft = function(){
      return $mdSidenav('left').isOpen();
    };

	$scope.$on("$mdMenuClose", function() { 
		$scope.selectedItem = previous;
	});

	var ethCall = function(data){
		$scope.ethPrice = numeral(data.PRICE).format('0,0.00');
		$scope.ethArrow = data.FLAGS === '1' ? up : drop;
		$scope.ethArrow = data.FLAGS === '4' ? same: $scope.ethArrow;
	}

	var btcCall = function(data){
		$scope.btcPrice = numeral(data.PRICE).format('0,0.00');
		$scope.btcArrow = data.FLAGS === '1' ? up : drop;
		$scope.btcArrow = data.FLAGS === '4' ? same: $scope.btcArrow;
	}

	if (!$scope.isSmall()) {
		tickerSrv.subscribe('BTC',btcCall);
		tickerSrv.subscribe('ETH',ethCall);
	}

	$scope.$watch('screenSize', function(){
		if (!$mdMedia('xs')) {
			tickerSrv.subscribe('BTC',btcCall);
			tickerSrv.subscribe('ETH',ethCall);
		}
	})


	
	$scope.$watch(function(){
		return angular.element('#pageTop')[0].clientHeight > 0;
	}, function(arg){
		//angular.element('#pageContent')[0].height(angular.element('#pageContent')[0].offsetheight+angular.element('#pageTop')[0].offsetHeight);
		//console.log(angular.element('#pageTop')[0].offsetHeight);
			//console.log($state.current.name == 'coinlist' || $state.current.name == 'news')
			var topHeaderHeight = angular.element('#pageTop')[0].clientHeight;
			var mobileTopHeight = angular.element('.md-nav-bar')[0].clientHeight;
			var footerHeight = angular.element('#footer').height()
			var height_offset = footerHeight + mobileTopHeight + topHeaderHeight;
			//console.log(height_offset,topHeaderHeight);
		
		if ($location.path() === '/' || $location.path() === '/news') {
			height_offset -= footerHeight;
		}

		angular.element('#pageContent').css('min-height','calc(100% - '+height_offset+'px)');
	})
});
