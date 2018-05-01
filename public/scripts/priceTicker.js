app.controller('priceTickerCtrl', function($scope, tickerSrv, $state, $transitions, userSrv, $http) {
	var up = "public/images/arrow_up.svg"
	var drop = "public/images/arrow_drop.svg"
	var same = "public/images/minus.svg"
	var userStatus;
	$scope.tabName = "SIGN IN";
	$scope.imgSrc = "/public/images/ic_account_circle_white_36pt.png";
	$scope.currentTheme = 'default';
	
	$transitions.onSuccess({}, function(transition) {
		userStatus = userSrv.authenticated({username: true, avatarImage: true}).then(function(res){
				$scope.tabName = res[0].username;
				$scope.imgSrc = String.fromCharCode.apply(null, res[0].avatarImage.data);
			
		}, function(err){
			$scope.tabName = "SIGN IN";
			$scope.imgSrc = "/public/images/ic_account_circle_white_36pt.png";
		});

		$scope.selectedItem = transition.to().name;
	});


	$scope.profileClick = function(mdMenu){
		if ($scope.tabName != "SIGN IN") {
			mdMenu.open();
			console.log($state)
			//$state.go('signedin',{userId: $scope.tabName});
		}
		else{
			$state.go('login');
		}
	}

	$scope.changeTheme = function(){
		console.log($scope.currentTheme == 'default')
		$scope.currentTheme = $scope.currentTheme == 'default' ? 'dark-default':'default';
		console.log($scope.drek)

	}

	$scope.signOut = function(){
		$http({
		    method: 'POST',
		    url: '/user',
		    data: {signout: true}
		}).then(function(res){
		    	console.log('signing out');
		    	$state.go('login');
		    })
	}

	$scope.$on("$mdMenuClose", function() { console.log("menu closing") });

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
