
const passport =  require('passport');
const dotenv = require('dotenv');
const strategy= require('passport-facebook');
const config = require('../config');

const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require('../middleware/auth')
const User = require("../models/user");

//face
const FacebookStrategy = strategy.Strategy;

/**
 * @method 
 * @param 
 * @description 
 */

//facebook login
dotenv.config();
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then((user) => {
    done(null,user)
  })
});

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_api_key,
      clientSecret: config.facebook_api_secret,
      callbackURL: config.callback_url,
      profileFields: ["email", "name"]
    },
    // function(accessToken, refreshToken, profile, done) {
    //   const { email, name, last_name } = profile._json;
    //   const userData = new User ({
    //     username: name,
    //     email,
    //     password: '',
    //     role:'2'
    //   });
    //   userData.save()
    //   done(null, profile);
    // }
    function(accessToken, refreshToken, profile, done) {
      // process.nextTick(function () {
      //   console.log(accessToken, refreshToken, profile, done);
      //   const { email, name} = profile._json;
      //   new User ({
      //     username: name,
      //     email: email,
      //     password:'',
      //     role:'2'
      //   }).save().then((newUser) => { console.log(newUser)});
      // });
        //check user
        const { email, first_name, last_name} = profile._json;
        User.findOne({socialId: profile.id}).then((currentUser) =>{
          if(currentUser){
            console.log('user is: ' + currentUser);
            done(null, currentUser);
          }
          else{
          const user = new User ({
            username: first_name + last_name,
            email: email,
            role:'2',
            socialId: profile.id
          });
          user.save().then((newUser) => {
            console.log(user);
            done(null, newUser);
          });
          }
        });
    }
  )
);
//router facebook
router.get("/auth/facebook/", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback/",
    passport.authenticate("facebook"),(req, res) => {
      const payload = {
        user: {
            id: req.user.id
        }
    };
    
    jwt.sign(
        payload,
        "randomString", {
            expiresIn: 10000
        },
        (err, token) => {
            if (err) throw err;
            res.status(200).json({
                token
            });
        }
    );
    }
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get("/success", (req, res) => {
  res.send("Success ");
});
//EndOfRouterFacebook
router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 0
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password,
            role
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password,
                role
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 0
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );
  router.get("/me", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });

module.exports = router;
