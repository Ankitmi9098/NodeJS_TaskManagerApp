const express = require("express");
const auth = require("../middleware/auth");
const { findById } = require("../models/user");
const router = new express.Router();
const User = require("../models/user");

//create users
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "You are logged out" });
  } catch (error) {
    res.status(500).send(error);
  }
});

//logout user from all platforms
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: "You have been logged out from all devices" });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // res.status(200).send({ user: await user.getPublicProfile(), token });
    // console.log(user);
    res.status(200).send({ user: user, token });
  } catch (e) {
    res.status(400).send();
  }
});

//get all the user details
router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//get my profile
router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//get user by ID
// router.get("/users/:id", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

//Update my profile
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isvalidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isvalidOperation) {
      return res.status(400).send({ error: "You cant update this parameter" });
    }
    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.status(200).send(req.user);
    } catch (e) {
      res.status(400).send();
    }
});

//Delete account
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = User.findByIdAndDelete(req.params.id); //when  we get ID in url. /users/:id
    // if (!user) {
    //   return res.status(404).send();
    // }

    await req.user.remove();
    res.send({ user: req.user, message: "Your account has been deleted" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
