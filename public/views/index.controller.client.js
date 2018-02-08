(function () {

    angular.module('bovcontrol')
        .controller('IndexController', function ($scope, $location, $window, HomeService, SearchService, TraktAuthService) {

            $scope.searchString= "";
            $scope.searchButton= true;

            $scope.search= function (hash, data) {
              console.log('Search Pressed: '+hash);
              SearchService.setSearchString(data);
              $location.path(hash);
            };

            $scope.results= {};
            $scope.url= '';

            function init() {
                TraktAuthService.getUrl()
                    .then(
                        function onSuccess(response){
                            console.log('Controller: Success\n'+JSON.stringify(response));
                            url= response.data;
                            $window.open(url);
                            console.log('URL: '+url);
                        },
                        function onError(error){
                            console.log('Controller: Error\n'+error);
                        }
                    );
            }
            if( $window.localStorage['authData'] == null ){
                $scope.searchButton= false;
                init();
            }

        });
})();