app.directive('onScroll', function($timeout,$window) {
    'use strict';

    return {
        scope: false,
        link: function(scope, element) {
            var scrollDelay = 500,
                scrollThrottleTimeout,
                throttled = false,
                scrollHandler = function() {
                    if (!throttled) {
                        if (scope.showFAB == false && $window.pageYOffset != 0) {
                            scope.showFAB = true;
                            //$rootScope.$apply();
                          }

                          else if($window.pageYOffset == 0 && scope.showFAB == true){
                            scope.showFAB = false;
                            //$rootScope.$apply();
                          } 
                        throttled = true;

                        scrollThrottleTimeout = $timeout(function(){
                            throttled = false;
                        }, scrollDelay);
                    }
                };

            angular.element($window).on("scroll", scrollHandler);

            scope.$on('$destroy', function() {
                angular.element($window).off('scroll', scrollHandler);
            });
        }
    };
});