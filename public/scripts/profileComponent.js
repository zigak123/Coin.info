app.component('profile',{
	bindings: {testingthis: '<'},
	controller: function ($scope,$state) {
	
	console.log(this)
	
	},
	templateUrl:'/public/templates/profile.html'
})