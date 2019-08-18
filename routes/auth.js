module.exports = (app, passport) => {
    app.post('/auth/openid', passport.authenticate('openid'));

    app.get('/auth/openid/return', passport.authenticate('openid'),
        function (request, response) {
            if (request.user) {
                response.redirect('/?steamid=' + request.user.steamId);
            } else {
                response.redirect('/?failed');
            }
        });

    app.post('/auth/logout', function (request, response) {
        request.logout();
        response.redirect(request.get('Referer') || '/')
    });

    app.get('/auth/login', function (req, res) {
        res.render('login')
    });
    return app
};