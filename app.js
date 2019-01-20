const express = require('express');
// Request library for api requests
const request = require("request");
// Apikey from file config.js see config.js.example
const apikey = require("./api/config.js");
const bodyParser = require('body-parser')
const app = express();
const cookieSession = require('cookie-session')
const passport = require('passport');
let api = require('./api/api.js')
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cookieSession({
    name: 'session',
    keys: ["DJIsACoolGuy"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const OpenIDStrategy = require('passport-openid').Strategy;
const SteamStrategy = new OpenIDStrategy({
    providerURL: 'http://steamcommunity.com/openid',
    stateless: true,
    returnURL: 'http://djlynch.us/auth/openid/return',
    realm: 'http://djlynch.us/',
},
    function (identifier, done) {
        process.nextTick(function () {
            var user = {
                identifier: identifier,
                steamId: identifier.match(/\d+$/)[0]
            };
            console.log(user);
            return done(null, user);
        });
    });

passport.use(SteamStrategy);


passport.serializeUser(function (user, done) {
    done(null, user.identifier);
});

passport.deserializeUser(function (identifier, done) {
    done(null, {
        identifier: identifier,
        steamId: identifier.match(/\d+$/)[0]
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.post('/auth/openid', passport.authenticate('openid'));

app.get('/auth/openid/return', passport.authenticate('openid'),
    function (request, response) {
        if (request.user) {
            response.redirect('/?steamid=' + request.user.steamId);
        } else {
            response.redirect('/?failed');
        }
    });

app.post('/auth/logout', function (request, response) {
    request.logout();
    response.redirect(request.get('Referer') || '/')
});

app.get('/auth/login', function (req, res) {
    res.render('login')
});

app.get('/', function (req, res) {
    if (req.user) {
        api.getFriends(req.user.steamId, (friends) => {
            api.getRealName(req.user.steamId, (user) => {
                res.render('index', { user, friends });
            });
        });
    } else {
        res.redirect('/auth/login')
    }
});

app.get('/yikes', function (req, res) {
    if (req.user) {
        api.getFriends(req.user.steamId, (friends) => {
            api.getRealName(req.user.steamId, (user) => {
                res.render('yikes', { user, friends });
            });
        });
    } else {
        res.redirect('/auth/login')
    }
});

// app.post('/yikes', function (req, res) {
//     if (req.user) {
//         if (req.body.friends) {
//             let friends = req.body.friends
//             console.log(friends);
//             api.getGames(req.user.steamId, (err, games) => {
//                 if (err) {
//                     console.log(err);
//                     res.send(err);
//                 }
//                 if (games) {
//                     let userGames = games;
//                     api.getGames(friends[0], (err, games) => {
//                         if (err) {
//                             console.log(err);
//                             res.send(err);
//                         }
//                         let friendGames = games;
//                         let sameGames = [];

//                         userGames.forEach((e1) => friendGames.forEach((e2) => {
//                             if (e1 === e2) {
//                                 sameGames.push(e1);
//                             }
//                         }
//                         ));
//                         res.send(sameGames);
//                     });
//                 }
//             });
//         }
//     } else {
//         res.redirect('/auth/login')
//     }
// });

const getGame = (steamId) => {

    return new Promise((resolve, reject) => {
        //(steamId) => {
        request(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apikey}&steamid=${steamId}&format=json&include_appinfo=1`,
            function (error, response, body) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    gamesList = JSON.parse(body);
                    //console.log(gamesList)
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
        //}
    });
}

app.post('/yikes', async function (req, res) {
    if (req.user) {
        if (req.body.friends) {
            let friends = req.body.friends
            const totalUsers = friends.length + 1
            console.log(totalUsers);
            let sameGames = [];
            let compGames = [];
            var counts = {};
            let userGames = await getGame(req.user.steamId);
            userGames = [...new Set(userGames)];
            compGames = compGames.concat(userGames);
            for (friend of friends) {
                let friendGames = await getGame(friend)
                // Need to make friendGames a set because they can have multiple of the same game.
                let set = [...new Set(friendGames)];
                compGames = compGames.concat(set)
                // userGames.forEach((e1) => friendGames.forEach((e2) => {
                //     if (e1 === e2) {
                //         sameGames.push(e1);
                //     }
                // }))
            }
            for (var i = 0; i < compGames.length; i++) {
                var num = compGames[i];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }
            //console.log(counts)
            for (count in counts) {
                //console.log(console.log(count));
                //console.log(counts[count])
                if (counts[count] === totalUsers) {
                    console.log(count);
                    sameGames.push(count)
                }
            }
            res.send(sameGames)
            //console.log(compGames.sort())
            //console.log(sameGames)
        }
    } else {
        res.redirect('/auth/login')
    }
});

const port = 4000;
app.listen(port);
console.log('Listening on port ' + port);
// api.getGames("76561198041498404", (err, games) => {

// });