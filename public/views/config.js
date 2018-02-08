(function () {
    angular.module('bovcontrol')
        .config(function ($routeProvider, $httpProvider) {

            // $httpProvider.defaults.headers.post['Content-Type']= 'application/json;charset=utf-8';
            // $httpProvider.defaults.headers.put['Content-Type']= 'application/json;charset=utf-8';

            $routeProvider
                .when('/', {
                    templateUrl: 'views/Home/template/home.view.client.html',
                    controller: 'HomeController',
                    controllerAs: 'ctrl'
                })
                .when('/search',{
                    templateUrl: 'views/Search/template/search.view.client.html',
                    controller: 'SearchController',
                    controllerAs: 'ctrl'
                })
                .when('/details',{
                    templateUrl: 'views/Detail/template/detail.view.client.html',
                    controller: 'DetailController',
                    controllerAs: 'ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                })

        });
})();