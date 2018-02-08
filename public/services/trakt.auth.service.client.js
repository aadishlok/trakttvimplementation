(function () {

    angular.module('bovcontrol')
        .factory('TraktAuthService', function ($http, $sce, $q) {

            var auth= {
                code: '',
                client_key: '6eb79439b84306d8ab9927eb8c4084ea',
                api_key: 'c8d87d9e833d9b83c7a8252072c11814',
                tmdb_api_key: 'a374d6c998d4c27c47f3d0cd9c9d4f99'
            };

             var authResponse= {
                 getUrl: function (){
                     console.log('Trakt Service getUrl');
                     return $http.get('/api/trakt/url');
                 },
                 authorize: function (code) {
                     console.log('Trakt Auth Client Service: '+code);
                     auth.code= code;
                     return $http.get('/api/trakt/auth/'+code);
                 },
                 trendingShows: function () {
                     return $http.get('/api/trakt/shows/trending');
                 },
                 fanartImages: function (id) {
                     return $http.get('http://webservice.fanart.tv/v3/tv/'+id,{
                         params:{
                             api_key: auth.api_key,
                             client_key: auth.client_key
                         }
                     });
                 },
                 showDetails: function (id) {
                     return $http.get('/api/trakt/show/details/'+id);
                 },
                 showSeasons: function (id) {
                     return $http.get('/api/trakt/show/seasons/'+id);
                 },
                 episodeImage: function(id, season, episode){
                     return $http.get('https://api.themoviedb.org/3/tv/'+id+'/season/'+season+'/episode/'+episode+'/images',{
                         params:{
                             api_key: auth.tmdb_api_key
                         },
                         cache: true
                     });
                 },
                 showSearch: function (data) {
                     return $http.post('/api/trakt/search',data);
                 },
                 showLists: function (data) {
                     return $http.get('/api/trakt/show/lists/'+data);
                 }
             };
            return authResponse;
        });
})();