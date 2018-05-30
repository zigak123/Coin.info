app.controller('priceTickerCtrl', function($scope, tickerSrv, $state, $transitions, userSrv, $http,$rootScope) {
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

	$transitions.onBefore({}, function(transition) {
		$scope.selectedItem = transition.to().name;
	});


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

	tickerSrv.subscribe('BTC',btcCall);
	tickerSrv.subscribe('ETH',ethCall);
});
