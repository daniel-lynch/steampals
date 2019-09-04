/**
 * Index Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const Index = require('../controllers/index.server.controller');

/**
 * Route handling logic
 * @param app - Express Application
 */
module.exports = function(app) {

  app.route('/')
    .get(Index.getIndex);

  app.route('/')
    .post(Index.postIndex);

}