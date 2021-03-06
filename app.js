const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  cors = require('cors'),
  indexRouter = require('./routes/index'),
  usersRouter = require('./routes/users'),
  projectsRouter = require('./routes/projects'),
  versionsRouter = require('./routes/versions'),
  app = express(),
  { DB } = require('./config'),
  mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  DB,
  err => {
    if (err) throw err
    console.log('Connected To Database')
  }
)
mongoose.set('debug', true)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/projects', projectsRouter)
app.use('/versions', versionsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
