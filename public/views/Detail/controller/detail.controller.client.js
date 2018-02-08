(function () {

    angular.module('bovcontrol')
        .controller('DetailController', function ($scope, $window, DetailService, TraktAuthService) {

            var ctrl= $scope;

            ctrl.status = {
                isCustomHeaderOpen: false,
                isFirstOpen: true,
                isFirstDisabled: false
            };


            function init(){
                var data= DetailService.getData();
                ctrl.show= new Object({
                    tmdbId: data.tmdbId || JSON.parse($window.localStorage['show']).tmdb,
                    id: data.id || JSON.parse($window.localStorage['show']).id,
                    title: data.title || JSON.parse($window.localStorage['show']).title,
                    year: data.year || JSON.parse($window.localStorage['show']).year,
                    imageUrl: data.imageUrl || JSON.parse($window.localStorage['show']).imageUrl,
                    bannerUrl: data.bannerUrl || JSON.parse($window.localStorage['show']).bannerUrl
                });
                console.log('Detail Controller:\n'+ ctrl.show+"\n"+JSON.parse($window.localStorage['show']).id);
                showLists(ctrl.show.id);
                showDetails(ctrl.show.id, ctrl.show.tmdbId);
                showSeasons(ctrl.show.id, ctrl.show.tmdbId);
            }init();

            ctrl.detail= {};
            function showDetails(id, tmdbId) {
                TraktAuthService.showDetails(id)
                    .then(
                        function onSuccess(response) {
                            detail= response.data;
                            //console.log('Show Details: \n'+detail.data);
                            ctrl.details= new Object({
                                tmdbId: tmdbId,
                                id: detail.data.ids.trakt,
                                firstAired: detail.data.first_aired,
                                title: detail.data.title,
                                overview: detail.data.overview,
                                runtime: detail.data.runtime,
                                trailer: detail.data.trailer,
                                homepage: detail.data.homepage,
                                rating: detail.data.rating,
                                genres: detail.data.genres
                            });
                        },
                        function onError(error) {
                            console.log('Show Details Error:\n'+error);
                        }
                    );
            }

            ctrl.seasons= [];
            function showSeasons(id, tmdbId) {
                TraktAuthService.showSeasons(id)
                    .then(
                        function onSuccess(response) {
                            buildSeasons(response.data.data, tmdbId);
                        },
                        function onError(error) {
                            console.log('Seasons Error:\n'+error);
                        }
                    );
            }

            ctrl.episodes= [];
            function buildSeasons(data, tmdbId){
                //console.log(data);
                for(var i= 0; i< data.length; i++){
                    (function (s) {
                        ctrl.seasons.push(new Object({
                            number: s.number,
                            title: s.title,
                            episodes: s.episodes,
                            episode_count: s.episode_count
                        }));
                    })(data[i]);
                }
            }

            ctrl.getEpisodes= function(tmdbId, seasonNumber){
                var seasonIndex= (ctrl.seasons.length === 1 && seasonNumber===1) ? 0 : seasonNumber;
                //console.log('Season Details:'+seasonIndex+'\n'+ctrl.seasons[seasonIndex]);
                for(var i=0; i< ctrl.seasons[seasonIndex].episode_count; i++){
                    (function (e) {
                        TraktAuthService.episodeImage(tmdbId, seasonNumber, e.number)
                            .then(
                                function onSuccess(response){
                                    e.imageUrl = (response.data.stills === null? "/images/noimage.jpg" :ctrl.base_url+"/"+ctrl.size+response.data.stills[0].file_path);
                                    //console.log("Episode:\n"+angular.toJson(angular.toJson(e)));
                                },
                                function onError(error){
                                    e.imageUrl= "/images/noimage.jpg";
                                }
                            );
                    })(ctrl.seasons[seasonIndex].episodes[i]);
                }
                return ctrl.seasons[seasonIndex].episodes;
            };


            ctrl.base_url= "https://image.tmdb.org/t/p";
            ctrl.size= "w342";
            ctrl.getImage= function (tmdbId, seasonNumber, episodeNumber) {
                TraktAuthService.episodeImage(tmdbId, seasonNumber, episodeNumber)
                    .then(
                        function onSuccess(response){
                            return (response.data.stills === null? "/images/noimage.jpg" :ctrl.base_url+"/"+ctrl.size+response.data.stills[0].file_path);
                        },
                        function onError(error){
                            return "/images/noimage.jpg";
                        }
                    );
            };

            var responseData= {};
            function showLists(id) {
                TraktAuthService.showLists(id)
                    .then(
                        function onSuccess(response) {
                            responseData= response.data;
                            ctrl.lists= responseData.data;
                            console.log('Lists:\n'+ctrl.lists);
                        },
                        function onError(error) {
                            console.log('Lists Error:\n'+error);
                        }
                    );
            }
        });
})();