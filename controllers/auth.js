const User = require('../models/user');
const { sendWelcomeMessage } = require('../emails/account');

module.exports.register = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeMessage(user.email, user.name);
    const token = await user.generateToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.status(200).json({
      user,
      token
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.status(200).json({ success: "Logged out!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json({ success: "Logged out all devices!" });
  } catch (error) {
    res.status(500).json(error);
  }
};