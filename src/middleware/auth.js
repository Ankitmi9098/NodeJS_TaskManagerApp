const User = require("../models/user");
const jwt = require("jsonWebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.token = token; //Adding token and user key-value in request body
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Autthenticate" });
  }
};

module.exports = auth;
