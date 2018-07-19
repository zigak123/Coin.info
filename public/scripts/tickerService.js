app.factory('tickerSrv',['$http','$rootScope','dataSrv',function($http, $rootScope, dataSrv){
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
              callbackArray[i].call(socket, res);
            }
          }
        });
  		}		
  	}
  });
    
  var subscribe = function (coinSymbol,callback, currency) {
    callbackArray.push(callback);
    coins.push(coinSymbol);
    socket.emit('SubAdd',{subs: ['5~CCCAGG~'+coinSymbol+'~'+currency]})
  }

  var unsubscribe = function (coinSymbol,callback, currency) {
    callbackArray.pop();
    coins.pop();
  		socket.emit('SubRemove',{subs: ['5~CCCAGG~'+coinSymbol+'~'+currency]})
  	
  }

  return {
    unsub: unsubscribe,
    subscribe: subscribe
  };
}])