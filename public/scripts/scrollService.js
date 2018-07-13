app.factory('scrollSrv',function($window,$rootScope){

  var scope = null;

  var on = function(fscope) {
    scope = fscope;
    angular.element("#pageContent").on("scroll",scrollFunction);
  };

  var off = function() {
    angular.element("#pageContent").off("scroll",scrollFunction);
    scope = null;
  };
	
  var scrollFunction = function() {
    //console.log(angular.element("#pageContent").scrollTop())
    //console.log('trigerring')
     if (scope.showFAB == false && angular.element("#pageContent").scrollTop() != 0) {
        scope.showFAB = true;
        scope.$apply();
      }

      else if(scope.showFAB == true && angular.element("#pageContent").scrollTop() == 0){
        scope.showFAB = false;
        scope.$apply();
      } 
  };


  return {
    off: off,
    on: on
  };
})