// Request library for api requests
const request = require("request");
const apikey = require("../config/config").steamApiKey;
// my steam id for testing
const mysteamid = "76561198041498404";

// Get games function, pass in steamid of the user, appinfo=1 returns the game name
exports.getGames = (steamId) => {
  return new Promise((resolve, reject) => {
    request(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apikey}&steamid=${steamId}&format=json&include_appinfo=1`,
      function (error, response, body) {
        if (error) {
          console.log(error);
          reject(error)
        } else {
          gamesList = JSON.parse(body);
          games = [];
          for (game in gamesList.response.games) {
            games.push(gamesList.response.games[game].name);
          }
          resolve(games)
        }
      });
  });
}

// Get friends function, returns all friends steam id's, relations, and how long they've been friends
exports.getFriends = (steamid, callback) => {
  request(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${apikey}&steamid=${steamid}&relationship=friend`,
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        friendslist = JSON.parse(body)
        friends = [];

        for (friend in friendslist.friendslist.friends) {
          friends.push(friendslist.friendslist.friends[friend].steamid);
        };
        this.getRealName(friends.join(), (friends) => { callback(friends) });
      };
    });
};

// Probably should be get steam user data, pass in an a string of steam ids comma delminated
exports.getRealName = (steamids, callback) => {
  request(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apikey}&steamids=${steamids}`,
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        res = JSON.parse(body);
        friends = []
        for (player in res.response.players) {
          friends.push(res.response.players[player])
        }
        callback(friends);
      }
    });
}