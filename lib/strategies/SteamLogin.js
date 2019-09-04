/**
 * Steam Login Strategy
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module Dependencies
 */
const OpenIDStrategy = require('passport-openid').Strategy;

/**
 * Steam Login Strategy Logic
 */

const steamLogin = new OpenIDStrategy({
  providerURL: 'http://steamcommunity.com/openid',
  stateless: true,
  returnURL: process.env.URL || 'https://steampals.io/auth/openid/return',
  realm: process.env.REALM || 'https://steampals.io/',
  }, function (identifier, done) {
      process.nextTick(function () {
        // TODO we should be checking to make sure there is actually a user no?
          var user = {
              identifier: identifier,
              steamId: identifier.match(/\d+$/)[0]
          };
          return done(null, user);
      });
    });

module.exports = steamLogin;