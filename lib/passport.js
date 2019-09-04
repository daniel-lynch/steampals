/**
 * Passport Middleware
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module Dependencies
 */
const passport = require('passport');

/**
 * Passport Configurations
 */
const SteamLogin = require('./strategies/SteamLogin');

/**
 * Passport Init
 */
passport.use('steam', SteamLogin);

/**
 * Passport Serialization
 */
passport.serializeUser(function(user, done){
    done(null, user.identifier);
});

/**
 * Passport Deserialization
 */
passport.deserializeUser(function(identifier, done){
    done(null, {
        identifier: identifier,
        steamId: identifier.match(/\d+$/)[0]
    });
});