const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = mongoose.model("user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const loginReq = require('../middleware/loginReq')

router.get('/protected',loginReq,(req,res)=> {
   res.send("Hello User") 
})

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the details" });
  }
  user
    .findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists." });
      } else {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const newUser = new user({
            email: email,
            password: hashedPassword,
            name: name,
          });
          newUser.save().then((newUser) => {
            res.json({ message: "Signed Up Successfully!" }).catch((err) => {
              console.log(err);
            });
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(422).json({ err: "Enter Email" });
  } else if (!password) {
    res.status(422).json({ err: "Enter Password" });
  } else {
    user.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ err: "Invalid Email/Password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((ifMatch) => {
          if (ifMatch) {
            //res.json({message:"Success"})
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const {_id, name, email} = savedUser;
            res.json({ token: token, user:{_id, name, email} });
          } else {
            return res.status(422).json({ err: "Invalid Email/Password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
});

module.exports = router;
