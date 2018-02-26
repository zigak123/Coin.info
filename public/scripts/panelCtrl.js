app.controller('PanelDialogCtrl', PanelDialogCtrl);


function PanelDialogCtrl(mdPanelRef,$scope,item,$http,$interval,tickerSrv) {
   panelRef = mdPanelRef;
   $scope.item= item;
   $scope.isLoading = true;

   tickerSrv.subscribe(item.Symbol);
   tickerSrv.on(item.Symbol,function (data) {
     console.log(data.PRICE +" "+ data.FROMSYMBOL);
     $scope.price = data.PRICE;
   })

    $scope.closeDialog = function(){
      panelRef && panelRef.close().then(function() {
        angular.element(document.querySelector('.demo-dialog-open-button')).focus();
        panelRef.destroy();
      });
    }

     function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var time = date + ' ' + month + ' ' + year + ' ' ;
      return time;
    }


   $http({
    method : "GET",
    url : "https://min-api.cryptocompare.com/data/histoday?fsym="+item.Symbol+"&tsym=USD&limit=30"
  }).then(function(response) {

      values = [];
      days = [];
      j = 0;
      n = response.data.Data.length;
      oldprice = (response.data.Data[n-1].open);
      
      for(i = 0; i < response.data.Data.length;i++){
        if (j++ % 10 == 0) {
            days.push(timeConverter(response.data.Data[i].time));}
        else{
            days.push('')};

        values.push(response.data.Data[i].close);
      }


      $scope.data = [values];
      $scope.series = ['Price'];
      $scope.labels = days;
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };

      $scope.isLoading = false;
      temp = ($scope.price / oldprice) > 1 ? ($scope.price / oldprice) - 1 : -1*(1 - ($scope.price / oldprice));
      $scope.change = (Math.round(((Math.round(temp*1000)/1000)*100)*100)/100)+"%";
      $scope.price_color = $scope.change >= 0 ? {"color":"green","display":"inline-block"} : {"color":"red"};
      
    }, function myError(response) {
      console.log(response);
  });
}