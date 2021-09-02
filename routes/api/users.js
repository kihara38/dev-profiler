const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load input validation
const validateRegisterInput=require('../../validation/register')

//load user model
const User = require("../../models/User");

//@route   get api/user/test
//@desc    test user route
//@access  public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

//@route   get api/user/register
//@desc    test register route
//@access  public
router.post("/register", (req, res) => {
    const {errors,isValid}=validateRegisterInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
        errors.email='Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(8, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//@route   get api/user/login
//@desc    login user / reurning jwt token
//@access  public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //fin user by email
  user.findOne({ email }).then((user) => {
    //check for user
    if (!user) {
      return res.status(404).json({ email: "user not found" });
    }

    //check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt payload

        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 36000 },
          (err, token) => {
            res.json({
              success: true,
              token: "bearer" + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "password incorrect" });
      }
    });
  });
});
//@route   get api/user/current
//@desc    return current user
//@access  private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
