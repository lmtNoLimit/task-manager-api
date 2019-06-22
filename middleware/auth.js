const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.auth = async (req, res, next) => {
  try {
    // get the token
    const token = req.header('Authorization').replace('Bearer ', '');
    // get the decoded data from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find the user from the data
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    if(!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "You must be logged in for this action!" });
  }
}