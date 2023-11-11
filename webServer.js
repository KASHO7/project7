"use strict";

var express = require("express");
var mongoose = require("mongoose");
var session = require("express-session");
var bodyParser = require("body-parser");
var multer = require("multer");
var cors = require("cors");
var bcrypt = require("bcrypt");
var async = require("async");
var fs = require("fs");

var app = express();

mongoose.connect("mongodb://localhost/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = require("bluebird");

var processFormBody = multer({ storage: multer.memoryStorage() }).single(
    "uploadedphoto"
);

app.use(express.static(__dirname));
app.use(cors());
app.use(
    session({
      secret: "secretKey",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Session will expire after 24 hours
      },
    })
);
app.use(bodyParser.json());

// Load Mongoose schema for User, Photo, and SchemaInfo (assuming you have these schemas defined)
var User = require("./schema/user.js");
var Photo = require("./schema/photo.js");
var SchemaInfo = require("./schema/schemaInfo.js");

// Middleware to check if the user is authenticated
function isAuthenticated(request, response, next) {
  if (request.session.user_id) {
    next();
  } else {
    response.status(401).send("Unauthorized");
  }
}

// Handle user login
app.post("/admin/login", function (request, response) {
  var loginName = request.body.login_name;
  var password = request.body.password;

  User.findOne({ login_name: loginName }, function (err, user) {
    if (err || !user) {
      response.status(400).send("Invalid login credentials");
      return;
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        request.session.user_id = user._id;
        response.status(200).json({
          message: "Login successful",
          user: {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        });
      } else {
        response.status(400).send("Invalid login credentials");
      }
    });
  });
});

// Handle user logout
app.post("/admin/logout", isAuthenticated, function (request, response) {
  request.session.destroy(function (err) {
    if (err) {
      response.status(500).send("Internal Server Error");
    } else {
      response.status(200).json({ message: "Logout successful" });
    }
  });
});

// Handle user registration
app.post("/user/register", function (request, response) {
  var {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      response.status(500).send("Internal Server Error");
      return;
    }

    User.create(
        {
          login_name: login_name,
          password: hash,
          first_name: first_name,
          last_name: last_name,
          location: location,
          description: description,
          occupation: occupation,
        },
        function (err, newUser) {
          if (err) {
            response.status(400).send("Bad Request");
          } else {
            response.status(200).json({
              message: "Registration successful",
              user: {
                _id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
              },
            });
          }
        }
    );
  });
});

// Handle other routes (add your route handlers here)

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(
      "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
