import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import favicon from 'serve-favicon'
import passport from 'passport'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import indexRouter from './src/routes'
import authRouter from './src/routes/auth'
import apiV1Router from './src/routes/api/v1'
import userRouter from './src/routes/user'

const app = express()

const DB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/gusec'
const FAVICON_URL = favicon(path.resolve('static/images/favicon.ico'))

// connect to database
mongoose.Promise = global.Promise
mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true },
  )
  .then(() => {
    console.log('Connected to Database')
  })
  .catch(err => console.error('Failed to connect to Database ', err))

app.set('views', path.resolve('src/views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))

// enable cors
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}

app.use(allowCrossDomain)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(path.resolve('static')))
app.use(FAVICON_URL)
app.use(passport.initialize())

// app routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/api/v1', apiV1Router)
app.use('/user', userRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
