const SteamAPI = require('steamapi');
const steam = new SteamAPI('386959403F7D32C15C5937873D2BFBFA');

steam.resolve('https://steamcommunity.com/id/ibesofearless').then(id => {
    console.log(id); // 76561198146931523
});

steam.getUserOwnedGames('76561198069528821').then(summary => {
  console.log(summary);
});

steam.getGameDetails('65980').then(summary => {
  console.log(summary);
});