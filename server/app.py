#!/usr/bin/env python3

from flask import Flask, request, jsonify, redirect, session, g
from flask_cors import CORS, cross_origin
from flask_openid import OpenID
from urllib import parse
import re
import requests
import json
import os
from urllib import parse
from waitress import serve
from mysql.connector import pooling
from mysql.connector import Error

"""
Pipe in enviornment varibles
"""

dbhost = os.environ.get('dbhost')
database = os.environ.get('database')
dbuser = os.environ.get('dbuser')
dbpassword = os.environ.get('dbpassword')
steamkey = os.environ.get('steamkey')
secret_key = os.environ.get('secret_key')
siteurl = os.environ.get('siteurl')
apiurl = os.environ.get('apiurl')

"""
MySQL Pooling Setup
"""

try:
    connection_pool = pooling.MySQLConnectionPool(pool_name="connection_pool",
                                                  pool_size=10,
                                                  pool_reset_session=True,
                                                  host=dbhost,
                                                  database=database,
                                                  user=dbuser,
                                                  password=dbpassword)

    # Get connection object from a pool
    connection_object = connection_pool.get_connection()

    if connection_object.is_connected():
        db_Info = connection_object.get_server_info()
        print("Connected to MySQL database using connection pool ... MySQL Server version on ", db_Info)

        cursor = connection_object.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("Your connected to - ", record)

        
except Error as e:
    print("Error while connecting to MySQL using Connection pool ", e)
finally:
    # closing database connection.
    if connection_object.is_connected():
        cursor.close()
        connection_object.close()

app = Flask(__name__)
app.config.update(
    SECRET_KEY = secret_key,
    DEBUG = True
)
CORS(app, supports_credentials=True, origins=siteurl)

def _query(query, args=None, commit=False):
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection()

        if connection_object.is_connected():
            cursor = connection_object.cursor()

            # Enforce UTF-8 for the connection.
            cursor.execute('SET NAMES utf8mb4')
            cursor.execute("SET CHARACTER SET utf8mb4")
            cursor.execute("SET character_set_connection=utf8mb4")
            
            if args:
                cursor.execute(query, args)

            if commit:
                connection_object.commit()
                return True
            else:
                cursor.execute(query)
                record = cursor.fetchone()
                return(True, record)

    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
        return(False, e)
    finally:
        # closing database connection.
        if connection_object.is_connected():
            cursor.close()
            connection_object.close()

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
        url = f"http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={steamkey}&steamid={steamid}&relationship=friend"
        request = requests.get(url).json()
        for friend in request["friendslist"]["friends"]:
            friends.append(friend["steamid"])
        steamids = ",".join(friends)
        url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamkey}&steamids={steamids}"
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
    gamesList = requests.get(f"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={steamkey}&steamid={steamId}&format=json&include_appinfo=1").json()

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

    return(_query(sql, args=val, commit=True))

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
        if userGames:
          userGames = list({v['appid']:v for v in userGames}.values()) # Sort by appid for dupes
          comparedGames.extend(userGames)

        for friendid in friends:
            friendid = friendid["steamid"]
            friendgames = getGames(friendid)
            if friendgames:
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
                status, gamedata = _query(query)
                
                if status and gamedata:
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
                    try:
                        description = re.search("<div[^>]* class=\\\"game_description_snippet\\\"[^>]*>([^<]*)</div>", storepage, re.MULTILINE).groups()[0].strip()
                    except:
                        description = None
                    try:
                        genre = re.search("<b>Genre:</b>\\s(?:[^>]*>)<a[^>]*>([^<]*)", storepage, re.MULTILINE).groups()[0]
                    except:
                        genre = "Unknown"
                    try:
                        labels = re.search("<div class=\\\"label\\\">([^<]*)", storepage, re.MULTILINE).groups()
                    except:
                        labels = None

                    newgameobj["info"]["multiplayer"] = "No"
                    multiplayer = 0
                    for tag in tags:
                        if tag == "Multiplayer" or tag == "Multi-player":
                            newgameobj["info"]["multiplayer"] = "Yes"
                            multiplayer = 1
                    if labels:
                        for label in labels:
                            if "Online" in label:
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
        'openid.return_to': f"{apiurl}/auth/openid/return", # put your url where you want to be redirect
        'openid.realm': apiurl
    }
    param_string = parse.urlencode(params)
    auth_url = steam_openid_url + "?" + param_string
    return redirect(auth_url)

@app.route('/auth/openid/nativedev', methods=['GET','POST'])
def steam():
    steam_openid_url = 'https://steamcommunity.com/openid/login'
    params = {
        'openid.ns': "http://specs.openid.net/auth/2.0",
        'openid.identity': "http://specs.openid.net/auth/2.0/identifier_select",
        'openid.claimed_id': "http://specs.openid.net/auth/2.0/identifier_select",
        'openid.mode': 'checkid_setup',
        'openid.return_to': f"{apiurl}/auth/openid/return/nativedev", # put your url where you want to be redirect
        'openid.realm': apiurl
    }
    param_string = parse.urlencode(params)
    auth_url = steam_openid_url + "?" + param_string
    return redirect(auth_url)

@app.route('/auth/logout', methods=['GET'])
def logout():
    del session['steamid']
    del session['name']
    return redirect(f"{siteurl}/login")

@app.route('/auth/openid/return', methods=['GET'])
def auth():
    args = request.args.to_dict()
    if validate(args):
        steam_id_re = re.compile('steamcommunity.com/openid/id/(.*?)$')
        match = steam_id_re.search(request.args['openid.claimed_id'])
        steamid = match.group(1)
        session['steamid'] = steamid
        url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamkey}&steamids={steamid}"
        requestobj = requests.get(url).json()
        session['name'] = requestobj["response"]["players"][0]["personaname"]
        return(redirect(f"{siteurl}/compare"))

@app.route('/auth/openid/return/nativedev', methods=['GET'])
def auth():
    args = request.args.to_dict()
    if validate(args):
        steam_id_re = re.compile('steamcommunity.com/openid/id/(.*?)$')
        match = steam_id_re.search(request.args['openid.claimed_id'])
        steamid = match.group(1)
        session['steamid'] = steamid
        url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamkey}&steamids={steamid}"
        requestobj = requests.get(url).json()
        session['name'] = requestobj["response"]["players"][0]["personaname"]
        return(redirect(f"exp://192.168.1.113:19000"))

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)
