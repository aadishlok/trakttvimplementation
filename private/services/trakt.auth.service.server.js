var Trakt= require('trakt.tv');

var options= {
    client_id: "f9801666bd320ded8e9c7fbfcb3d9adbd7ad45ba350088054a92a7209152dd9a",
    client_secret: "077e45e15c9239efd04916ae1eceb838aef00b2b5e748329bc8068d0010441bd",
    plugins: {
        images: require('trakt.tv-images')
    },
    options:{
        images: {
            fanartApiKey: 'c8d87d9e833d9b83c7a8252072c11814',
            tmdbApiKey: 'a374d6c998d4c27c47f3d0cd9c9d4f99'
        }
    },
    redirect_uri: null,
    api_url: null,
    useragent: null,
    pagination: true,
    debug: true
};

var trakt= new Trakt(options);

module.exports= function (app) {

    app.get('/api/trakt/url', getUrl);
    app.post('/api/trakt/search', showSearch);
    app.get('/api/trakt/auth/:code', authorize);
    app.get('/api/trakt/shows/trending', trendingShows);
    app.get('/api/trakt/show/details/:id', showDetails);
    app.get('/api/trakt/show/seasons/:id', showSeasons);
    app.get('/api/trakt/show/lists/:id', showLists);
  //app.get('/api/trakt/episode/image/:id', episodeImage);

    function getUrl(req, res) {
        console.log('Get URL');
        res.send(trakt.get_url());
    }

    function authorize(req, res) {
        console.log('Url Server'+req.params.code);
        trakt.exchange_code(req.params.code).then(
            function onSuccess(success) {
                console.log('Auth Success:\n'+success);
                res.json(success);
            },
            function onError(error) {
                console.log('Auth Error:\n'+error);
                res.sendStatus(404).send(error);
            });
    }

    function trendingShows(req, res) {
        console.log('Trending Shows');
        trakt.shows.trending().then(
            function onSuccess(success) {
                res.json(success);
            },
            function onError(error) {
                res.sendStatus(404).send(error);
            });
    }

    function showDetails(req,res) {
        console.log('Show Details'+req.params.id);
        trakt.shows.summary({
            id: req.params.id,
            extended: 'full'
        }).then(
            function onSuccess(success) {
                res.json(success);
            },
            function onError(error) {
                res.sendStatus(404).send(error);
            }
        );
    }

    function showSeasons(req, res){
        console.log('Show Seasons'+req.params.id);
        trakt.seasons.summary({
            id: req.params.id,
            extended: ['full', 'episodes']
        }).then(
          function onSuccess(success) {
              res.json(success);
          },
          function onError(error) {
              res.sendStatus(404).send(error);
          }
        );
    }

    function episodeImage(req, res){
        console.log('Episode Image'+req.params.id);
        trakt.images.get({
            tmdb: req.params.id
        }).then(
            function onSuccess(success){
                res.json(success);
            },
            function onError(error){
                res.sendStatus(404).send(error);
            }
        );
    }

    function showSearch(req, res){
        console.log('Search: '+req.body.text);
        trakt.search.text({
            query: req.body.text,
            type: 'show'
        }).then(function onSuccess(success) {
            res.json(success);
        },function onError(error) {
            console.log('Search Error: '+error);
        }).catch(console.log);
    }

    function showLists(req, res){
        console.log('Lists: '+req.params.id);
        trakt.shows.lists({
            id: req.params.id,
            type: 'all',
            sort: 'popular'
        }).then(function onSuccess(success) {
            res.json(success);
        }, function onError(error) {
            res.sendStatus(404).send(error);
        }).catch(console.log);
    }

};