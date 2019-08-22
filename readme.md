# ReadMe

## Get Started

```
git clone https://github.com/daniel-lynch/steampals.git
cd steampals.io
npm install
cp config/config.js.example config/config.js
touch .env

Edit config/config.js

Enter a secret key or array of secret keys in exports.cookieKeys = [""];
Example:
    exports.cookieKeys = ["This is a Secret key"];

Enter your Steam Api Key in exports.steamApiKey = "";
Example:
    exports.steamApiKey = "SteamApiKeyHere";
A Steam Api Key can obtained here https://steamcommunity.com/dev/apikey

Edit .env

URL="http://localhost/auth/openid/return"
REALM="http://localhost/"

node app.js

Go to http://localhost
```
