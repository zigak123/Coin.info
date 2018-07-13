AmCharts.addMovingAverage = function (dataSet, panel, field, averageLength) {

var avgField = "avg1";
var avgField200 = "avg2";

dataSet.fieldMappings.push({
fromField: avgField,
toField: avgField});

dataSet.fieldMappings.push({
fromField: avgField200,
toField: avgField200});


 var fc = 0;
 var sum = 0;
 var fc200 = 0;
 var sum200 = 0;

 for (var i = 0; i < dataSet.dataProvider.length; i++) {
   var dp = dataSet.dataProvider[i];
   if (dp[field] !== undefined && dp[field] !== undefined) {
     sum += dp[field];
     fc++;
     sum200 += dp[field];
     fc200++;

     if (i >= 70) {
     	sum = sum - dataSet.dataProvider[i-70].close;
     	fc = 70;
     }

      if (i >= 200) {
      sum200 = sum200 - dataSet.dataProvider[i-200].close;
      fc200 = 200;
     }     

     dp[avgField] = (sum / fc);
     dp[avgField200] = (sum200 / fc200);
   }
 }


  panel.stockGraphs[2].valueField = avgField;
  panel.stockGraphs[2].periodValue = "Average";
  panel.stockGraphs[2].balloonText = "MA 70:<b> [[value]] <b>"
  panel.stockGraphs[2].lineColor = "#00e676";

  panel.stockGraphs[3].valueField = avgField200;
  panel.stockGraphs[3].periodValue = "Average";
  panel.stockGraphs[3].balloonText = "MA 200:<b> [[value]] <b>"


}