app.component('article',{
    bindings: { article: '<'},
templateUrl: '/public/templates/article.html',
controller: function ($scope, $stateParams) {
    $scope.article = $stateParams.article;
}
});