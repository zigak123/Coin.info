app.component('article',{
    bindings: { article: '<'},
templateUrl: '/public/templates/article.html',
controller: function ($scope, $stateParams,$rootScope) {
    $scope.article = $stateParams.article;
    console.log($rootScope)
}
});