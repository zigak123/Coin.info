app.controller('priceTickerCtrl', function($scope, tickerSrv, $state, $transitions, userSrv) {
	var up = "public/images/arrow_up.svg"
	var drop = "public/images/arrow_drop.svg"
	var same = "public/images/minus.svg"
	$scope.showFAB = true;

	$transitions.onSuccess({}, function(transition) {
		console.log(transition.from().name+" to: "+transition.to().name)
		userStatus = userSrv.authenticated().then(function(res){
			//console.log(res)
			if (res[0] != undefined) {
				$scope.tabName = res[0].username;
				$scope.imgSrc = String.fromCharCode.apply(null, res[0].avatarImage.data);
			}
			else{
				$scope.tabName = "SIGN IN";
				$scope.imgSrc = "/public/images/ic_account_circle_white_36pt.png";
			}
		});
		
		if (userStatus == 200) {
			console.log('dela') 
		}
		$scope.selectedItem = transition.to().name;

	});


	$scope.profileClick = function(){
		console.log('profile click dela!')
	}

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
