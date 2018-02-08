(function () {

    angular.module('bovcontrol')
        .factory('SearchService', function ($http) {

            var searchString= "";
            var api= {
                getSearchResults: getSearchResults,
                setSearchString: setSearchString,
                getSearchString: getSearchString
            }
            return api;

            function getSearchResults() {
                console.log('Search Service');
            }

            function setSearchString(data) {
                searchString= data;
            }

            function getSearchString() {
                return searchString;
            }
        });

})();