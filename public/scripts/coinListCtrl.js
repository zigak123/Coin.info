app.component("coinlist", {
controller:
    function($scope, $http, $interval, $mdPanel, tickerSrv) {

    var _mdPanel = $mdPanel;

    $http.get("coinlist")
    .then(function(response) {
        $scope.coins = response.data
    });  

    $scope.searchText = function(query){
       return $http.get("search?text="+query)
            .then(function(response) {
                return response.data;
            }); 
    }

    $scope.showDialog = function(item) {

      var position = _mdPanel.newPanelPosition()
          .center();

      var config = {
            attachTo: angular.element(document.body),
            controller: PanelDialogCtrl,
            controllerAs: 'ctrl',
            disableParentScroll: true,
            templateUrl: 'public/templates/coinPanel.tmpl.html',
            hasBackdrop: true,
            panelClass: 'demo-dialog-example',
            position: position,
            trapFocus: true,
            zIndex: 150,
            focusOnOpen: true,
            onRemoving: function(){tickerSrv.unsub(item.Symbol);},
            locals: {
            item: item
            }
          };

          _mdPanel.open(config);
    };

}, templateUrl: '/public/templates/coinList.html'})