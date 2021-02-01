#!/usr/bin/env python3

from flask import Flask, request, jsonify, redirect, session, g
from flask_cors import CORS, cross_origin
from flask_openid import OpenID
from urllib import parse
import re
import mysql.connector
import requests
import json
import os
from urllib import parse
from waitress import serve


"""
Pipe in enviornment varibles
"""

dbhost = os.environ.get('dbhost')
database = os.environ.get('database')
dbuser = os.environ.get('dbuser')
dbpassword = os.environ.get('dbpassword')
steamkey = os.environ.get('steamkey')

db = mysql.connector.connect(
  host=dbhost,
  database=database,
  user=dbuser,
  password=dbpassword
)
cursor = db.cursor()

steamKey = steamkey

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="https://steampals.io")
app.config.update(
    SECRET_KEY = 'Something very secure.',
    DEBUG = True
)

def validate(signed_params):
    steam_login_url_base = "https://steamcommunity.com/openid/login"

    params = {
        "openid.assoc_handle": signed_params["openid.assoc_handle"],
        "openid.sig": signed_params["openid.sig"],
        "openid.ns": signed_params["openid.ns"],
    }

    signed_params.update(params)

    signed_params["openid.mode"] = "check_authentication"
    signed_params["openid.signed"] = signed_params["openid.signed"]

    r = requests.post(steam_login_url_base, data=signed_params)

    if "is_valid:true" in r.text:
        return True

    # this fucntion should always return false if the payload is not valid
    return False

@app.route('/api/v1/getfriends', methods=['GET'])
def getfriends():
    if checklogin(session):
        friends = []
        steamid = session['steamid']
        url = f"http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={steamKey}&steamid={steamid}&relationship=friend"
        request = requests.get(url).json()
        for friend in request["friendslist"]["friends"]:
            friends.append(friend["steamid"])
        steamids = ",".join(friends)
        url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamKey}&steamids={steamids}"
        friends = []
        request = requests.get(url).json()
        for friend in request["response"]["players"]:
            personastate = "Offline"
            status = "offline"
            if friend["personastate"] == 0:
                personastate = "Offline"
                status = "offline"
            if friend["personastate"] == 1:
                personastate = "Online"
                status = "online"
            if friend["personastate"] == 2:
                personastate = "Busy"
                status = "busy"
            if friend["personastate"] == 3:
                personastate = "Away"
                status = "away"

            if "gameextrainfo" in friend:
                status = "inGame"
                personastate = friend["gameextrainfo"]

            friends.append({"steamid": friend["steamid"], "pic": friend["avatarmedium"], "name": friend["personaname"], "status": personastate, "type": status})
            

        sort_order = ['online','inGame','away','offline']

        friends.sort(key = lambda i: sort_order.index(i['type']))

        cid = 1
        for friend in friends:
            friend["id"] = cid
            cid += 1
        return(jsonify(friends))
    else:
        return(jsonify({"isloggedin": "False"}), 401)

def getGames(steamId):
    gamesList = requests.get(f"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={steamKey}&steamid={steamId}&format=json&include_appinfo=1").json()

    if gamesList['response']:
        games = []
        for game in gamesList['response']['games']:
            games.append(game)

        return(games)
    else:
        return(None)

def insertGame(appid, name, description, tags, multiplayer, blacklist=0):
    if tags:
        tags = ",".join(tags)
    sql = "INSERT INTO games (id, name, description, tags, multiplayer, blacklist) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (appid, name, description, tags, multiplayer, blacklist)
    cursor.execute(sql, val)
    db.commit()
    return(cursor.rowcount)

@app.route('/api/v1/comparegames', methods=['POST'])
def comparegames():
    if checklogin(session):
        steamid = session['steamid']
        friends = request.json
        totalUsers = len(friends) + 1

        sameGames = []
        comparedGames = []
        gameCounts = {}

        userGames = getGames(steamid)
        userGames = list({v['appid']:v for v in userGames}.values()) # Sort by appid for dupes

        comparedGames.extend(userGames)

        for friendid in friends:
            friendid = friendid["steamid"]
            friendgames = getGames(friendid)
            friendgames = list({v['appid']:v for v in friendgames}.values()) # Sort by appid for dupes
            comparedGames.extend(friendgames)

        for game in comparedGames:
            if game["appid"] in gameCounts:
                gameCounts[game["appid"]]["count"] += 1
            else:
                gameCounts[game["appid"]] = {"count": 1, "gameobj": game}

        for game in gameCounts:
            if gameCounts[game]["count"] == totalUsers:
                gameobj = gameCounts[game]["gameobj"]
                appid = gameobj['appid']
                
                query = f"SELECT * FROM games WHERE id={appid};"
                cursor.execute(query)
                gamedata = cursor.fetchone()
                
                if gamedata:
                    if gamedata[5]:
                        continue
                    tags = gamedata[3].split(",")
                    storeinfo = {"name": "", "image": "", "info": {}, "storelink": ""}
                    storeinfo["name"] = gameobj["name"]
                    storeinfo["image"] = f"https://steamcdn-a.akamaihd.net/steam/apps/{appid}/header.jpg"
                    storeinfo["info"]["storelink"] = f"https://store.steampowered.com/app/{appid}/"
                    storeinfo["info"]["shortdesc"] = gamedata[2]
                    storeinfo["info"]["genre"] = tags[0]
                    storeinfo["info"]["multiplayer"] = "Yes" if gamedata[4] else "No"
                    storeinfo["info"]["tags"] = tags[:3]
                    sameGames.append(storeinfo)

                else:

                    newgameobj = {"name": "", "image": "", "info": {}, "storelink": ""}
                    newgameobj["name"] = gameobj["name"]
                    newgameobj["image"] = f"https://steamcdn-a.akamaihd.net/steam/apps/{appid}/header.jpg"
                    newgameobj["info"]["storelink"] = f"https://store.steampowered.com/app/{appid}/"

                    storepage = requests.get(f"https://store.steampowered.com/app/{appid}/")

                    if storepage.history:
                        insertGame(appid, None, None, None, None, blacklist=1)
                        continue
                    else:
                        storepage = storepage.text

                    tags = re.findall("<a[^>]*class=\\\"app_tag\\\"[^>]*>([^<]*)</a>", storepage, re.MULTILINE)
                    tags = [x.strip() for x in tags]

                    description = re.search("<div[^>]* class=\\\"game_description_snippet\\\"[^>]*>([^<]*)</div>", storepage, re.MULTILINE).groups()[0].strip()

                    genre = re.search("<div class=\\\"details_block\\\">\\s*<b>Title:</b>[^<]*<br>\\s*<b>Genre:</b>\\s*(<a[^>]*>([^<]+)</a>,?\\s*)+\\s*<br>", storepage, re.MULTILINE).groups()[1]

                    newgameobj["info"]["multiplayer"] = "No"
                    multiplayer = 0
                    for tag in tags:
                        if tag == "Multiplayer" or tag == "Multi-player":
                            newgameobj["info"]["multiplayer"] = "Yes"
                            multiplayer = 1

                    newgameobj["info"]["shortdesc"] = description
                    newgameobj["info"]["genre"] = genre
                    newgameobj["info"]["tags"] = tags[:3]

                    sameGames.append(newgameobj)

                    insertGame(appid, newgameobj["name"], newgameobj["info"]["shortdesc"], tags, multiplayer)

        return(jsonify(sameGames), 200)
    else:
        return(jsonify({"isloggedin": "False"}), 401)

@app.route('/auth/isloggedin', methods=['GET'])
def isloggedin():
    if checklogin(session):
        return(jsonify({"isloggedin": "True", "name": session['name']}), 200)
    else:
        return(jsonify({"isloggedin": "False"}), 401)

def checklogin(session):
    if 'steamid' in session:
        return(True)
    else:
        return(False)

@app.route('/test', methods=['GET'])
def index():
    if 'steamid' in session:
        return f"Logged in as {session['steamid']}"
    return redirect('/auth/openid')

@app.route('/auth/openid', methods=['GET','POST'])
def steam():
    steam_openid_url = 'https://steamcommunity.com/openid/login'
    params = {
        'openid.ns': "http://specs.openid.net/auth/2.0",
        'openid.identity': "http://specs.openid.net/auth/2.0/identifier_select",
        'openid.claimed_id': "http://specs.openid.net/auth/2.0/identifier_select",
        'openid.mode': 'checkid_setup',
        'openid.return_to': 'https://api.steampals.io/auth/openid/return', # put your url where you want to be redirect
        'openid.realm': 'https://api.steampals.io/'
    }
    param_string = parse.urlencode(params)
    auth_url = steam_openid_url + "?" + param_string
    return redirect(auth_url)

@app.route('/auth/logout', methods=['GET'])
def logout():
    del session['steamid']
    del session['name']
    return redirect('https://steampals.io/login')

@app.route('/auth/openid/return', methods=['GET'])
def auth():
    args = request.args.to_dict()
    if validate(args):
        steam_id_re = re.compile('steamcommunity.com/openid/id/(.*?)$')
        match = steam_id_re.search(request.args['openid.claimed_id'])
        steamid = match.group(1)
        session['steamid'] = steamid
        url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamKey}&steamids={steamid}"
        requestobj = requests.get(url).json()
        session['name'] = requestobj["response"]["players"][0]["personaname"]
        return(redirect("https://steampals.io/compare"))

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)
