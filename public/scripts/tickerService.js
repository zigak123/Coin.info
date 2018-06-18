app.factory('tickerSrv',function($http, $rootScope){
	var socket = io.connect('https://streamer.cryptocompare.com/');
  var callbackArray = [];
  var coins = [];


  socket.on('m', function (message) {  
  var messageType = message.substring(0, message.indexOf("~"));
  var res = {};

	if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
		res = CCC.CURRENT.unpack(message);
		if (!isNaN(res.PRICE)) {
			$rootScope.$apply(function () {
        for (var i = 0; i < callbackArray.length; i++) {
          if (coins[i] === res.FROMSYMBOL) {
            callbackArray[i].call(socket, res);;
          }
        }
      });
		}		
	}

  });
    
  var subscribe = function (coinSymbol,callback) {
    callbackArray.push(callback);
    coins.push(coinSymbol);
    socket.emit('SubAdd',{subs: ['5~CCCAGG~'+coinSymbol+'~USD']})
  }

  var unsubscribe = function (coinSymbol,callback) {
    callbackArray.pop();
    coins.pop();
  	if (coinSymbol !== 'ETH' && coinSymbol !== 'BTC'){
  		socket.emit('SubRemove',{subs: ['5~CCCAGG~'+coinSymbol+'~USD']})
  	}
  }

  return {
    unsub: unsubscribe,
    subscribe: subscribe
  };
})