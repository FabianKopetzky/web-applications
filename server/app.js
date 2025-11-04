var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var MongoClient = require('mongodb').MongoClient;

var userRouter = require('./routes/user');
var householdRouter = require('./routes/household');

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

// mongodb
const connection = process.env.MONGODB_CONNECTION_STRING;

(async () => {
  try {
    const client = new MongoClient(connection);
    await client.connect();
    const db = client.db('household_organizer');

    app.set('db', db); // save a reference to the db to app config

    // start server
    app.listen(port, () => {
      console.log(`Household organizer listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();

app.use('/api/user', userRouter);
app.use('/api/household', householdRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
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

module.exports = app;
