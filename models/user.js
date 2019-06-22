const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if(value.includes('password')) {
        throw new Error("Password should not contain the word 'password'")
      }
    }
  },
  age: {
    type: Number,
    min: 18,
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true,
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'author'
});

userSchema.methods = {
  toJSON() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
  },
  async generateToken() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.tokens.push({ token });
    await user.save();
    return token;
  }
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  // if user not found
  if(!user) {
    throw new Error('Email or password is incorrect. Please try again');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  // if password is not match
  if(!isMatch) {
    throw new Error('Email or password is incorrect. Please try again');
  }
  // if everything ok
  return user;
}

// hash the password
userSchema.pre('save', async function (next) {
  const user = this;
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// delete user's task when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({ author: user._id });
  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;