app.factory('scrollSrv',function($window){

  var calls = [];
  var scope = null;

  var on = function(fscope) {
    scope = fscope;
    angular.element($window).on("scroll",scrollFunction);
    console.log('haha this is working on')
  };

  var off = function() {
    angular.element($window).off("scroll",scrollFunction);
    console.log('haha this is working off')
  };
	
  var scrollFunction = function() {
     if ($window.pageYOffset > 0 && scope.showFAB == false) {
        scope.showFAB = true;
        scope.$apply();
      }

      else if($window.pageYOffset == 0 && scope.showFAB == true){
        scope.showFAB = false;
        scope.$apply();
      } 

      console.log('haha this is working scroooool'+scope)
  };


  return {
    off: off,
    on: on
  };
})