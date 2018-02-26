app.factory('tickerSrv',function($http,$rootScope){
	var socket = io.connect('https://streamer.cryptocompare.com/');

	var on = function (coinSymbol, callback) {
	    socket.on('m', function (message) {  

	    var messageType = message.substring(0, message.indexOf("~"));
		var res = {};

		if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
			res = CCC.CURRENT.unpack(message);
			//console.log(res)
			if (!isNaN(res.PRICE) && (res.FROMSYMBOL === coinSymbol || coinSymbol.indexOf(res.FROMSYMBOL) !== -1)) {
				$rootScope.$apply(function () {
          			callback.call(socket,res);
        		});
			}		
		}
      });
    }

    var subscribe = function (coinSymbol) {
      socket.emit('SubAdd',{subs: ['5~CCCAGG~'+coinSymbol+'~USD']})
    }

    var unsubscribe = function (coinSymbol) {
    	if (coinSymbol !== 'ETH' && coinSymbol !== 'BTC'){
    		socket.emit('SubRemove',{subs: ['5~CCCAGG~'+coinSymbol+'~USD']})
    	}
    }

  return {
    on: on,
    unsub: unsubscribe,
    subscribe: subscribe
  };
})