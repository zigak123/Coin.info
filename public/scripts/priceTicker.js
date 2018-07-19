app.controller('priceTickerCtrl', ['$scope', 'tickerSrv', '$state', '$transitions', 'userSrv', '$http','$rootScope','$mdSidenav','$mdMedia', 'dataSrv','$window','$timeout',function($scope, tickerSrv, $state, $transitions, userSrv, $http,$rootScope,$mdSidenav,$mdMedia, dataSrv,$window,$timeout) {
	var up = "public/images/arrow_up.svg"
	var drop = "public/images/arrow_drop.svg"
	var same = "public/images/minus.svg"
	$rootScope.currentTheme = 'default';
	var previous = $scope.selectedItem;
	var themes = [{icon: "/public/images/moon.svg", label:"Dark Theme", name: "darkDefault"},{icon: "/public/images/ic_wb_sunny_black_24px.svg", label:"Light Theme", name: "default"}]
	var userAgent = navigator.userAgent.toLowerCase();
	var isAndroidChrome = /chrome/.test(userAgent) && /android/.test(userAgent);
	var isIOSChrome = /crios/.test(userAgent);
	$scope.ethInfo = [null,null];
	$scope.btcInfo = [null,null];
	
	var adjustShit = function(){
		$timeout(function() {
			var heights = Math.min(document.documentElement.clientHeight, window.screen.height, window.innerHeight);
			var topHeaderHeight = angular.element('#pageTop')[0].clientHeight;
			var mobileTopHeight = angular.element('.md-nav-bar')[0].clientHeight;
			var height_offset = mobileTopHeight + topHeaderHeight;
			angular.element('#pageContent').css('height',(heights-height_offset)+'px');
		});
	};

	$transitions.onSuccess({}, function(transition) {

		userSrv.authenticated({username: true, avatarImage: true, theme: true}).then(function(res){
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
		$scope.ethInfo[0] = numeral(data.PRICE).format('0,0.00');
		$scope.ethInfo[1] = data.FLAGS === '1' ? up : drop;
		//$scope.ethInfo.push(data.FLAGS === '4' ? same: $scope.ethArrow);
	}

	var btcCall = function(data){
		$scope.btcInfo[0] = numeral(data.PRICE).format('0,0.00');
		$scope.btcInfo[1] = data.FLAGS === '1' ? up : drop;
		//$scope.btcArrow = data.FLAGS === '4' ? same: $scope.btcArrow;
	}

	if (!$scope.isSmall()) {
		tickerSrv.subscribe('BTC',btcCall,dataSrv.getCurrency());
		tickerSrv.subscribe('ETH',ethCall,dataSrv.getCurrency());
	}

	$scope.$watch('screenSize', function(){
		if (!$mdMedia('xs')) {
			tickerSrv.subscribe('BTC',btcCall,dataSrv.getCurrency());
			tickerSrv.subscribe('ETH',ethCall,dataSrv.getCurrency());
		}

		else{
			tickerSrv.unsub('BTC',btcCall);
			tickerSrv.unsub('ETH',ethCall);
		}
	})

	$scope.$on('user:updated', function(event,data) {  
    	tickerSrv.unsub('BTC',btcCall,dataSrv.getPrevious());
		tickerSrv.unsub('ETH',ethCall,dataSrv.getPrevious());
		tickerSrv.subscribe('BTC',btcCall,dataSrv.getCurrency());
		tickerSrv.subscribe('ETH',ethCall,dataSrv.getCurrency());

		if (dataSrv.getCurrency() === 'BTC') {
			$scope.btcInfo[0] = "1.00";
		}
   });

	angular.element($window).on('resize orientationchange', adjustShit);
	$timeout(adjustShit);

	
}]);
