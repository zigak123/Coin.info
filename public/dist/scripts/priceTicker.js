app.controller("priceTickerCtrl",["$scope","tickerSrv","$state","$transitions","userSrv","$http","$rootScope","$mdSidenav","$mdMedia","dataSrv","$window","$timeout",function(n,r,t,e,u,a,i,c,o,s,l,m){var g="public/dist/images/arrow_up.svg",f="public/dist/images/arrow_drop.svg";i.currentTheme="default";var h=n.selectedItem,d=[{icon:"/public/dist/images/moon.svg",label:"Dark Theme",name:"darkDefault"},{icon:"/public/dist/images/ic_wb_sunny_black_24px.svg",label:"Light Theme",name:"default"}],b=navigator.userAgent.toLowerCase();/chrome/.test(b)&&/android/.test(b),/crios/.test(b);n.ethInfo=[null,null],n.btcInfo=[null,null];var p,T=function(){m(function(){var e=Math.min(document.documentElement.clientHeight,window.screen.height,window.innerHeight),t=angular.element("#pageTop")[0].clientHeight,n=angular.element(".md-nav-bar")[0].clientHeight+t;angular.element("#pageContent").css("height",e-n+"px")})};e.onSuccess({},function(e){u.authenticated({username:!0,avatarImage:!0,theme:!0}).then(function(e){n.tabName=e[0].username,n.imgSrc=String.fromCharCode.apply(null,e[0].avatarImage.data),i.currentTheme=e[0].theme,n.themeStuff="default"===i.currentTheme?d[0]:d[1]},function(e){n.tabName="SIGN IN",n.imgSrc="/public/dist/images/ic_account_circle_white_36pt.png"}),n.selectedItem=e.to().name,h=n.selectedItem}),n.screenSize,n.isSmall=function(){return n.screenSize=o("xs"),o("xs")},n.profileClick=function(e){"SIGN IN"!=n.tabName?e.open():t.go("login")},n.changeTheme=function(){i.currentTheme="default"===i.currentTheme?"darkDefault":"default",n.themeStuff="default"===i.currentTheme?d[0]:d[1],a({method:"POST",url:"/theme",data:{theme:i.currentTheme}})},n.signOut=function(){a({method:"POST",url:"/user",data:{signout:!0}}).then(function(e){t.go("login")})},n.close=function(e){c("left").close().then(function(){"user"===e&&"SIGN IN"!==n.tabName?t.go("signedin",{userId:n.tabName}):t.go(e)})},n.toggleLeft=(p="left",function(){c(p).toggle().then(function(){$log.debug("toggle "+p+" is done")})}),n.isOpenLeft=function(){return c("left").isOpen()},n.$on("$mdMenuClose",function(){n.selectedItem=h});var S=function(e){n.ethInfo[0]=numeral(e.PRICE).format("0,0.00"),n.ethInfo[1]="1"===e.FLAGS?g:f},C=function(e){n.btcInfo[0]=numeral(e.PRICE).format("0,0.00"),n.btcInfo[1]="1"===e.FLAGS?g:f};n.isSmall()||(r.subscribe("BTC",C,s.getCurrency()),r.subscribe("ETH",S,s.getCurrency())),n.$watch("screenSize",function(){o("xs")?(r.unsub("BTC",C),r.unsub("ETH",S)):(r.subscribe("BTC",C,s.getCurrency()),r.subscribe("ETH",S,s.getCurrency()))}),n.$on("user:updated",function(e,t){r.unsub("BTC",C,s.getPrevious()),r.unsub("ETH",S,s.getPrevious()),r.subscribe("BTC",C,s.getCurrency()),r.subscribe("ETH",S,s.getCurrency()),"BTC"===s.getCurrency()&&(n.btcInfo[0]="1.00")}),angular.element(l).on("resize orientationchange",T),m(T)}]);