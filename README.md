# steampals.io

This project was incepted to help friends find games they own similary on steam. There are some planned features coming soon in our roadmap, but for now this is very early access (Alpha). 

You can see the production product on https://steampals.io.

## Getting Started

**Clone and install dependencies**
```bash
# Clone repository
git clone https://github.com/daniel-lynch/steampals.git

# Enter steampals directory
cd steampals

# Install dependencies
npm install
```

**Create configs and input Steam API Key**

*Note: If you do not have a Steam API key, obtain one from here: https://steamcommunity.com/dev/apikey*
```bash
# Create base steamCredentials file
cp config/env/steamCredentials.js.example config/env/steamCredentials.js

# Edit config/env/steamCredentials.js file and replace steamApiKey

# Create .env file
touch .env

# Edit .env
URL="http://localhost:3000/auth/openid/return"
REALM="http://localhost:3000/"
```
*Note: If you change the application port, you will need to change these urls*

**Start application**
```bash
# Use Nodemon/Node to start application
node app.js
```
Go to http://localhost:3000

## Contributing

We appreciate any contributions, please create an issue describing the changes you are planning on implementing before submitting a Pull Request. If changes are accepted, you can then fork, and create a pull request with your modifications or additions.

## Authors
  - Daniel Lynch <<daniel.lynch@datayard.us>>
  - Anthony Loukinas <<anthony.loukinas@redhat.com>>