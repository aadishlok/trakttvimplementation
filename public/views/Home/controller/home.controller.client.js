(function () {

    angular.module('bovcontrol')
        .controller('HomeController', function ($scope, $window, $location, HomeService, DetailService, TraktAuthService) {

            var ctrl= $scope;

            ctrl.headline= "Welcome to assessment central";
            ctrl.tagline= "Please search for your favorite TV series";

            ctrl.searchString= HomeService;


            ctrl.trendingShowsResults= [];
            ctrl.trending= [];
            ctrl.imageResults= [];
            ctrl.code= '';
            ctrl.tokenCheck= (window.localStorage['authData'] == null);

            if( ctrl.tokenCheck != null ){
                console.log('Authorized');
                trendingShows();
            }

            ctrl.authorize=  function(code){
                TraktAuthService.authorize(code)
                    .then(
                        function onSuccess(response) {
                            //console.log('Auth Success '+angular.toJson(response.data));
                            $window.localStorage['authData']= angular.toJson(response.data);
                        },
                        function onError(error) {
                            console.log('Auth Error '+error);
                        }
                    );
            }

            function trendingShows() {
                TraktAuthService.trendingShows()
                    .then(
                        function onSuccess(response) {
                            console.log('Trending Shows Success:\n');
                            trendingShowsResults= response.data;
                            //console.log(trendingShowsResults.data);
                            buildTrending();
                            //showImages(trendingShowsResults.data[5].show.ids.tvdb)
                        },
                        function onError(error) {
                            console.log('Trending Shows Error: '+error);
                        }
                    );
            }

            function showImages(id){
                TraktAuthService.fanartImages(id)
                    .then(
                        function onSuccess(response) {
                            imageResults= response.data;
                        },
                        function onError(error) {
                            console.log('Show Image Error:\n'+error);
                        }
                    );
            }

            function buildTrending(){

                for(var i= 0; i< trendingShowsResults.data.length; i++){
                    (function (tsr) {
                        TraktAuthService.fanartImages(tsr.show.ids.tvdb)
                            .then(
                                function onSuccess(response) {
                                    imageResults= response.data;
                                    ctrl.trending.push(new Object({
                                        tmdbId: tsr.show.ids.tmdb,
                                        id: tsr.show.ids.trakt,
                                        title: tsr.show.title,
                                        year: tsr.show.year,
                                        imageUrl: imageResults.tvthumb === undefined? '/images/noimage.jpg': imageResults.tvthumb[0].url,
                                        bannerUrl: imageResults.tvbanner === undefined? '': imageResults.tvbanner[0].url
                                    }));
                                },
                                function onError(error) {
                                    ctrl.trending.push(new Object({
                                        tmdbId: tsr.show.ids.tmdb,
                                        id: tsr.show.ids.trakt,
                                        title: tsr.show.title,
                                        year: tsr.show.year,
                                        imageUrl: '/images/noimage.jpg',
                                        bannerUrl: ''
                                    }));
                                }
                            );
                    })(trendingShowsResults.data[i]);
                }
                console.log(ctrl.trending);
            }

            ctrl.redirectToDetails= function(show) {
                //console.log('Setting Data ' + show);
                $window.localStorage['show']= JSON.stringify(show);
                DetailService.setData(show);
            };

        });

})();