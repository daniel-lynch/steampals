module.exports = (app, passport) => {
    const OpenIDStrategy = require('passport-openid').Strategy;
    const SteamStrategy = new OpenIDStrategy({
        providerURL: 'http://steamcommunity.com/openid',
        stateless: true,
        returnURL: process.env.URL || 'https://steampals.io/auth/openid/return',
        realm: process.env.REALM || 'http://steampals.io/',
    },
        function (identifier, done) {
            process.nextTick(function () {
                var user = {
                    identifier: identifier,
                    steamId: identifier.match(/\d+$/)[0]
                };
                return done(null, user);
            });
        });

    passport.use(SteamStrategy);


    passport.serializeUser(function (user, done) {
        done(null, user.identifier);
    });

    passport.deserializeUser(function (identifier, done) {
        done(null, {
            identifier: identifier,
            steamId: identifier.match(/\d+$/)[0]
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    return app
};