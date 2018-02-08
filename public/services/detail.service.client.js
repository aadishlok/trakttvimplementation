(function () {

    angular.module('bovcontrol')
        .factory('DetailService', function ($http) {

            var show= {};

            var api= {
                setData: setData,
                getData: getData,
                getDetails: getDetails
            }
            return api;

            function getDetails() {
                console.log('Detail Service');
            }

            function setData(data) {
                show= new Object(data);
            }

            function getData(){
                return show;
            }

        });
})();