/**
 * Index Server Controller
 * Handles logic for all routes matching "/"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module Dependencies
 */
const api = require('../api/api');

/**
 * Handles logic for "/".
 * Currently we are handling routing to your default route based
 * on what user type you are.
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getIndex = (req, res) => {
  if (req.user) {
    api.getFriends(req.user.steamId, (friends) => {
        api.getRealName(req.user.steamId, (user) => {
            res.render('index', { user, friends });
        });
    });
  } else {
      res.redirect('/auth/login')
  }
};

exports.postIndex = async (req, res) => {
  if (req.user) {
    if (req.body.friends) {
        const friends = req.body.friends
        const totalUsers = friends.length + 1
        let sameGames = [];
        let compGames = [];
        let counts = {};
        let userGames = await api.getGames(req.user.steamId);
        userGames = [...new Set(userGames)];
        compGames = compGames.concat(userGames);
        for (friend of friends) {
            let friendGames = await api.getGames(friend)
            // Need to make friendGames a set because they can have multiple of the same game.
            let set = [...new Set(friendGames)];
            compGames = compGames.concat(set)
        }
        for (let i = 0; i < compGames.length; i++) {
            let num = compGames[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        for (count in counts) {
            if (counts[count] === totalUsers) {
                sameGames.push(count)
            }
        }
        if (sameGames !== undefined && sameGames.length != 0){
            res.send(sameGames)
        } else {
            res.status(404).send()
        }
    }
  } else {
      res.redirect('/auth/login')
  }
}