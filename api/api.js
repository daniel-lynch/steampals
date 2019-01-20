// Request library for api requests
const request = require("request");
// Apikey from file config.js see config.js.example
const apikey = require("./config.js");
// my steam id for testing
const mysteamid = "76561198041498404";

// Get games function, pass in steamid of the user, appinfo=1 returns the game name
exports.getGames = (steamid, callback) => {
  request(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apikey}&steamid=${steamid}&format=json&include_appinfo=1`,
    function (error, response, body) {
      if (error) {
        console.log(error);
        callback(error, null);
      } else {
        gamesList = JSON.parse(body);
        games = [];
        //console.log(gamesList.response);
        for (game in gamesList.response.games) {
          games.push(gamesList.response.games[game].name);
          //console.log(gamesList.response.games[game].name);
        }
        callback(null, games);
      }
    }
  );
};

exports.getGamesarr = new Promise((resolve, reject) => {
  (steamid) => {
    request(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apikey}&steamid=${steamid}&format=json&include_appinfo=1`,
      function (error, response, body) {
        if (error) {
          console.log(error);
          reject(error)
        } else {
          gamesList = JSON.parse(body);
          console.log(gamesList)
          games = [];
          //console.log(gamesList.response);
          for (game in gamesList.response.games) {
            games.push(gamesList.response.games[game].name);
            //console.log(gamesList.response.games[game].name);
            //callback(null, games);
          }
          resolve(games)
        }
      });
  }
});

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
        //console.log(res)
        friends = []
        for (player in res.response.players) {
          console.log(res.response.players[player]);
          friends.push(res.response.players[player])
        }
        callback(friends);
      }
    });
}

//getFriends(mysteamid);