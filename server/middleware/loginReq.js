const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const mongoose = require("mongoose");
const user = mongoose.model("user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "Please Login" });
  }
  const token = authorization.replace("Bearer: ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(401).json({ err: "Please Log In.." });
    }
    const { _id } = payload;
    user.findById(_id).then(userData =>{
        req.user = userData
        next()
    })
    
  });
};
