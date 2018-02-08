(function () {

    angular.module('bovcontrol')
        .controller('SearchController', function ($scope, SearchService, TraktAuthService, DetailService) {

            var ctrl= $scope;
            ctrl.searchResults= [];
            ctrl.imageResults= [];

            function init() {
                ctrl.searchString= SearchService.getSearchString();
                TraktAuthService.showSearch({text: ctrl.searchString})
                    .then(
                        function onSuccess(response) {
                            console.log('Search Success: '+angular.toJson(response.data.data));
                            var results= response.data.data;
                            for(var i=0; i< results.length; i++){
                                (function (r) {
                                    TraktAuthService.fanartImages(r.show.ids.tvdb)
                                        .then(
                                            function onSuccess(response) {
                                                imageResults= response.data;
                                                ctrl.searchResults.push(new Object({
                                                    tmdbId: r.show.ids.tmdb,
                                                    id: r.show.ids.trakt,
                                                    title: r.show.title,
                                                    year: r.show.year,
                                                    imageUrl: imageResults.tvthumb === undefined? '/images/noimage.jpg': imageResults.tvthumb[0].url,
                                                    bannerUrl: imageResults.tvbanner === undefined? '/image/noimage.jpg': imageResults.tvbanner[0].url
                                                }));
                                            },
                                            function onError(error) {
                                                ctrl.searchResults.push(new Object({
                                                    tmdbId: r.show.ids.tmdb,
                                                    id: r.show.ids.trakt,
                                                    title: r.show.title,
                                                    year: r.show.year,
                                                    imageUrl: '/images/noimage.jpg',
                                                    bannerUrl: '/image/noimage.jpg'
                                                }));
                                            }
                                        );
                                })(results[i]);
                            }
                        },
                        function onError(error) {
                            console.log('Search Error: '+error);
                        }
                    );
                console.log('Search Results: '+ctrl.searchResults);
            }init();

            ctrl.redirectToDetails= function(show) {
                console.log('Setting Data ' + show);
                DetailService.setData(show);
            };
        });
})();