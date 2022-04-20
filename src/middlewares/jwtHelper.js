const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const {
  jwt: { expiresIn, accessTokenSecret, refreshTokenSecret },
} = require("../utilities/environment")

// const client = require("../utilities/init_redis");
const User = require("../models/User");
const { roles } = require("../roles");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = accessTokenSecret;
      const options = {
        expiresIn: expiresIn,
        audience: userId
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  },

  // NOT IN USE
  verifyAccessToken: (req, res, next) => {
    const authHeader = req.headers["auth_key"];
    if (!authHeader) return next(createError.Unauthorized());
    const token = authHeader;
    JWT.verify(token, accessTokenSecret, (err, payload) => {
      if (err) {
        const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      console.log(req.payload);
      next();
    });
  },
  // signRefreshToken: (userId) => {
  //   return new Promise((resolve, reject) => {
  //     const payload = {};
  //     const secret = refreshTokenSecret;
  //     const options = {
  //       expiresIn: "1y",
  //       audience: userId,
  //     };
  //     JWT.sign(payload, secret, options, (err, token) => {
  //       if (err) {
  //         console.log(err.message);
  //         reject(createError.InternalServerError());
  //       }

  //       client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
  //         if (err) {
  //           console.log(err.message);
  //           reject(createError.InternalServerError());
  //           return;
  //         }
  //         resolve(token);
  //       });
  //     });
  //   });
  // },
  // verifyRefreshToken: (refreshToken) => {
  //   return new Promise((resolve, reject) => {
  //     JWT.verify(refreshToken, refreshTokenSecret, (err, payload) => {
  //       if (err) return reject(createError.Unauthorized());
  //       const userId = payload.aud;

  //       client.GET(userId, (err, result) => {
  //         if (err) {
  //           console.log(err.message);
  //           reject(createError.InternalServerError());
  //           return;
  //         }
  //         if (refreshToken === result) return resolve(userId);
  //         reject(createError.Unauthorized());
  //       });
  //     });
  //   });
  // },

  verifyAdmin: async (req, res, next) => {
    if (req.user?.role?.key !== "admin") {
      console.log("jwtHelper,", createError.Unauthorized());
      return next(createError.Unauthorized());
    }
    else next();
  },

  grantAccess: function (action, resource) {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user?.role?.key)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  },

  allowIfLoggedin: async (req, res, next) => {
    try {
      const user = res.locals.loggedInUser;
      if (!user)
        return res.status(401).json({
          error: "You need to be logged in to access this route",
        });
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  },
};
