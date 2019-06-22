const User = require("../models/user");
const sharp = require('sharp');
const { sendCancelationEmail } = require('../emails/account');

module.exports.readProfile = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "email", "password", "age"];
  const isValidate = updates.every(update => validUpdates.includes(update));
  if (!isValidate) {
    return res.status(404).json({ error: "Invalid update!" });
  }
  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.uploadAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 300, height: 300 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.status(200).send();
}, (error, req, res, next) => {
  if(error) {
    res.status(400).json({ error: error.message });
  }
  next();
}

module.exports.deleteAvatar = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
}

module.exports.getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.status(200).send(user.avatar);
  } catch (error) {
    res.status(404).send()
  }  
}