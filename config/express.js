module.exports = (app, express) => {
    const bodyParser = require('body-parser'),
        cookieSession = require('cookie-session'),
        keys = require('./config').cookieKeys;
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(cookieSession({
        name: 'session',
        keys: keys,

        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    return app
}