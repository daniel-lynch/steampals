/**
 * Auth Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const passport      = require('passport'),
  passportService   = require('../lib/passport'),
  Auth              = require('../controllers/auth.server.controller');

/**
 * Use Passport Authentication Strategies
 * @type {AuthenticateRet}
 */
const requireLogin = passport.authenticate(
  ['steam'], {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: false
  }
)


/**
 * Route handling logic
 * @param app - Express Application
 */
module.exports = function(app) {

  app.route('/auth/openid')
    .post(requireLogin);

  app.route('/auth/openid/return')
    .get(requireLogin, Auth.getReturn);

  app.route('/auth/logout')
    .get(Auth.getLogout);

  app.route('/auth/login')
    .get(Auth.getLogin);
    
}