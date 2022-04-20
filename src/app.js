const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
const helmet = require("helmet");
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const JWT = require("jsonwebtoken");
const swaggerData = require('./swagger.json')
const path = require('path');
const passport = require('passport');
const session = require('express-session');

require("dotenv").config();
require('./utilities/dbConnection');

const app = express()

const {
  port,
  hostName,
  protocol,
  jwt: { accessTokenSecret },
} = require('./utilities/environment');

const User = require("../src/models/User");
const ErrorLog = require("../src/models/ErrorLog");


require('./utilities/twilliosms')
const route = require('./routes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
// app.use(helmet());
app.use("/", express.static(path.join(__dirname, "../dist/public")));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData))

/* Passport js Integration */

// app.set('view engine', 'ejs');
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

// app.set('view engine', 'ejs');

app.use(async (req, res, next) => {
  if (req.headers["auth_key"]) {
    const accessToken = req.headers["auth_key"];
    const { exp, aud } = await JWT.verify(accessToken, accessTokenSecret);
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    }
    res.locals.loggedInUser = await User.findById(aud, { password: 0 }).populate({
      path: 'role',
      model: 'role',
      select: '_id key'
    }).lean();

    next();
  } else {
    next();
  }
});


/* Routes */
app.use('/api/v1', route)

/* Route Not Found*/
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  let now = new Date();
  const sendObj = { success: false, message: 'Catched in Error Handler !', error: err || {}, date: new Date(now.getTime() + (330 * 60 * 1000)) };
  sendObj.error.url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  ErrorLog.create(sendObj);
  
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// const PORT = port || 8080;
const PORT = process.env.PORT || port;

app.listen(PORT, () => {
  console.log(`Server is running on ${protocol}://${hostName}:${PORT}`);
});
