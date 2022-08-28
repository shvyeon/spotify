const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const dotenv = require("dotenv");

dotenv.config();

const userService = require("./user-service.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

/* TODO environment variables  */
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = process.env.JWT_SECRET;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log("payload received", jwt_payload);

  if (jwt_payload) {
    next(null, {
      _id: jwt_payload._id,
      userName: jwt_payload.userName,
    });
  } else {
    next(null, false);
  }
});

passport.use(strategy);
app.use(passport.initialize());

/* TODO Add Your Routes Here */
// to check its working or not
app.post("/", (req, res) => {
  res.json({ message: "server open" });
});

app.get("/", (req, res) => {
  res.send("Its working");
});

// POST /api/user/register
app.post("/api/user/register", (req, res) => {
  userService
    // registerUser = function (userData)
    .registerUser(req.body)
    .then(() => {
      res.json({ message: "register success" });
    })
    .catch((msg) => {
      res.status(422).json({ message: "422 Unprocessable Entity" });
    });
});

// POST /api/user/login
app.post("/api/user/login", (req, res) => {
  userService
    // checkUser = function (userData)
    .checkUser(req.body)
    .then((user) => {
      var payload = {
        _id: user._id,
        userName: user.userName,
      };
      var token = jwt.sign(payload, jwtOptions.secretOrKey, {
        expiresIn: 30 * 60,
      });
      res.json({ message: "login successful", token: token });
    })
    .catch(() => {
      res.status(422).json({ message: "422 Unprocessable Entity" });
    });
});

// GET /api/user/favourites – (protected using the passport.authenticate() middleware)
app.get(
  "/api/user/favourites",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    userService
      // getFavourites = function (id)
      .getFavourites(req.user._id)
      .then((list) => {
        res.json(list);
      })
      .catch(() => {
        res.status(402).json({ message: "402 Payment Required" });
      });
  }
);

// PUT /api/user/favourites/:id – (protected using the passport.authenticate() middleware)
app.put(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    userService
      // addFavourite = function (id, favId)
      .addFavourite(req.user._id, req.params.id)
      .then((list) => {
        res.json(list);
      })
      .catch(() => {
        res.status(402).json({ message: "402 Payment Required" });
      });
  }
);

// DELETE /api/user/favourites/:id – (protected using the passport.authenticate() middleware)
app.delete(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    userService
      // removeFavourite = function (id, favId)
      .removeFavourite(req.user._id, req.params.id)
      .then((list) => {
        res.json(list);
      })
      .catch(() => {
        res.status(402).json({ message: "402 Payment Required" });
      });
  }
);

// a6 given code
userService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("API listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
