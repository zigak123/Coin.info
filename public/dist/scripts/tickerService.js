app.factory("tickerSrv",["$http","$rootScope","dataSrv",function(t,r,n){var u=io.connect("https://streamer.cryptocompare.com/"),c=[],p=[];u.on("m",function(t){var n=t.substring(0,t.indexOf("~")),o={};n==CCC.STATIC.TYPE.CURRENTAGG&&(o=CCC.CURRENT.unpack(t),isNaN(o.PRICE)||r.$apply(function(){for(var t=0;t<c.length;t++)p[t]===o.FROMSYMBOL&&c[t].call(u,o)}))});return{unsub:function(t,n,o){c.pop(),p.pop(),u.emit("SubRemove",{subs:["5~CCCAGG~"+t+"~"+o]})},subscribe:function(t,n,o){c.push(n),p.push(t),u.emit("SubAdd",{subs:["5~CCCAGG~"+t+"~"+o]})}}}]);