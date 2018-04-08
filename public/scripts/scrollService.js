app.factory('scrollSrv',function($window){

  var scope = null;

  var on = function(fscope) {
    scope = fscope;
    angular.element($window).on("scroll",scrollFunction);
  };

  var off = function() {
    angular.element($window).off("scroll",scrollFunction);
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
  };


  return {
    off: off,
    on: on
  };
})