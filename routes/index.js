module.exports = (app, api) => {

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


    app.post('/', async function (req, res) {
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
    });

    return app
};