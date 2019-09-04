/**
 * Index Server Controller
 * Handles logic for all routes matching "/"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module Dependencies
 */
const api = require('../api/api');

// TODO clean this up
const SteamAPI = require('steamapi');
const steam = new SteamAPI('386959403F7D32C15C5937873D2BFBFA');

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
        const friends = req.body.friends;
        const totalUsers = friends.length + 1;

        let sameGames = [];
        let comparedGames = [];

        let gameCounts = {};
        // This is where we need to figure out looping over Game Objects @daniel.lynch
        let userGames = await steam.getUserOwnedGames(req.user.steamId);

        userGames = [...new Set(userGames)];
        comparedGames = comparedGames.concat(userGames); // Array[Array[], Array[]]

        for (friendUuid of friends) {
            let friendGames = await api.getGames(friendUuid)
            // Need to make friendGames a set because they can have multiple of the same game.
            let set = [...new Set(friendGames)];
            // Games["Elder Scrolls", "Elder Scrolls", "Counter Strike", "Batallion 1944"]
            comparedGames = comparedGames.concat(set)
        }

        // for (Games["Elder Scrolls", "Elder Scrolls", "Counter Strike", "Batallion 1944"])
        // {
        //     "Elder Scrolls": 2,
        //     "Counter Strike": 1,
        //     "Batallion 1944": 1
        // }
        for (let i = 0; i < comparedGames.length; i++) {
            let gameArrayIndex = comparedGames[i];
            gameCounts[gameArrayIndex] = gameCounts[gameArrayIndex] ? gameCounts[gameArrayIndex] + 1 : 1;
        }

        for (count in gameCounts) {
            if (gameCounts[count] === totalUsers) {
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