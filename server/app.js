var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var OAuth2Server = require('express-oauth-server');
var register = require('./routes/register');
const oAuthModel = require('./oAuthModel');

 // this connects the OAuthServer to our Database

var MongoClient = require('mongodb').MongoClient;

var userRouter = require('./routes/user');
var householdRouter = require('./routes/household');
var authRouter = require('./routes/auth');
const api = require('./routes/api');;


require('dotenv').config();

var app = express();

const port = process.env.PORT || 3000;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// oauth database connect

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // in OAuth2 standard, credentials are sent as "application/x-www-form-urlencoded", this middleware allows parsing it

const routes = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    await client.connect();
    const db = client.db('household_organizer');
  
    app.set('db', db);
  
    db.collection('token').createIndex({ accessTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
    db.collection('token').createIndex({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
    db.collection('token').createIndex({ emailTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
  
    const oauth = new OAuth2Server({ model: oAuthModel(db) });
  
     app.use('/api/register', register, oauth.token({ requireClientAuthentication: { password: false, refresh_token: false } }));
          app.use('/api/login', authRouter, oauth.token({ requireClientAuthentication: { password: false, refresh_token: false } }));
    app.use('/api/token', oauth.token({ requireClientAuthentication: { password: false, refresh_token: false } }));
   
    app.use('/api', oauth.authenticate(), api);
    app.use("/api", authRouter); // adds /api/login and /api/logout
    app.use('/api/user', userRouter);
    app.use('/api/household', householdRouter);

    app.get('/routes', (req, res) => {
      const routes = [];
      app._router.stack.forEach((middleware) => {
        if (middleware.route) {
          routes.push(middleware.route);
        } else if (middleware.name === 'router') {
          middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
              routes.push(handler.route);
            }
          });
        }
      });
      res.json(routes);
    });

    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.use(function (req, res) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  
    app.listen(port, () => console.log(`Example app listening on port ${port}`));
  } catch (err) {
    console.error(err);
  }
};

routes();

module.exports = app;
