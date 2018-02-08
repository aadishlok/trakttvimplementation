
module.exports= function (app) {
    require('./services/trakt.auth.service.server')(app);
};