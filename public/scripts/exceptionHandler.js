angular.
  module('exceptionOverwrite', []).
  factory('$exceptionHandler', ['$log', 'logErrorsToBackend', function($log, logErrorsToBackend) {
    return function myExceptionHandler(exception, cause) {
    	console.log('dela exce')
      logErrorsToBackend(exception, cause);
      $log.warn(exception, cause);
    };
  }]);