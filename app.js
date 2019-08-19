const express = require('express'),
    passport = require('passport'),
    api = require('./api/api.js'),
    port = process.env.PORT || 80;
let app = express();

//configs
require('./config/express.js')(app, express);
require('./config/passport.js')(app, passport);

//routes
require('./routes/auth')(app, passport);
require('./routes/index')(app, api);


app.listen(port);
console.log(`Listening on port ${port}`);