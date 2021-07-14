const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const loginReq = require("../middleware/loginReq");
const post = mongoose.model("post");

router.get("/allPosts", loginReq, (req, res) => {
  post
    .find()
    .populate("postedBy", " _id name")
    .then((allPosts) => {
      res.json({ allPosts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createPost", loginReq, (req, res) => {
  const { title, pic } = req.body;
  console.log(title, pic);
  if (!pic) {
    res.status(422).json({ error: "Select a Photo" });
  }
  req.user.password = undefined;
  const newPost = new post({
    title: title,
    photo: pic,
    postedBy: req.user,
  });
  newPost
    .save()
    .then((result) => {
      res.json({ newPost: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myPosts", loginReq, (req, res) => {
  post
    .find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name")
    .then((myPosts) => {
      res.json({ myPosts: myPosts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", loginReq, (req, res) => {
  post
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/dislike", loginReq, (req, res) => {
  post
    .findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", loginReq, (req, res) => {
  post
    .findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json( result );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
