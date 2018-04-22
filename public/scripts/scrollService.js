app.factory('scrollSrv',function($window,$rootScope){

  var scope = null;

  var on = function(fscope) {
    scope = fscope;
    angular.element($window).on("scroll",scrollFunction);
  };

  var off = function() {
    angular.element($window).off("scroll",scrollFunction);
    scope = null;
  };
	
  var scrollFunction = function() {
     if (scope.showFAB == false && $window.pageYOffset != 0) {
        scope.showFAB = true;
        scope.$apply();
      }

      else if(scope.showFAB == true && $window.pageYOffset == 0){
        scope.showFAB = false;
        scope.$apply();
      } 
  };


  return {
    off: off,
    on: on
  };
})