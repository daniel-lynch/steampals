/**
 * Express Configuration
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const fs              = require('fs'),
    express           = require('express'),
    bodyParser        = require('body-parser'),
    cookieParser      = require('cookie-parser'),
    app               = express(),
    passport          = require('passport'),
    path              = require('path'),
    cookieSession     = require('cookie-session'),
    compression       = require('compression'),
    Keygrip           = require('keygrip'),
    config            = require('./config'),
    api               = require('../api/api.js');

module.exports = function() {
  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, '../public/dist/images', 'favicon.png')));

  // Should be placed before express.static
  app.use(compression({
    // only compress files for the following content types
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    // zlib option for compression level
    level: 9
  }));

  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', config.templateEngine);

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
      app.locals.cache = 'memory';
      app.set('view cache', true);
  }

  // Setting the app router and static folder
  app.use(express.static(path.join(__dirname, '../public'))); // this should be /public/dist when we webPack

  // CookieParser should be above session
  app.use(cookieParser());

  app.use(cookieSession({
    name: config.sessionName,
    keys: new Keygrip(['NEEDTOAMEKTHISMORESECURE'], 'SHA512', 'base64'),
    maxAge: config.sessionCookie.maxAge // 24 hours
  }));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));

  // Init passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup user
  app.get('*', function(req,res,next){
      res.locals.user = req.user || null;
      next();
  });

  // Globbing routing files
  config.getGlobbedFiles('./routes/**/*.js').forEach(function(routePath) {
      require(path.resolve(routePath))(app);
  });

  // Return Express server instance
  return app;
}