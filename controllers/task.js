const Task = require("../models/task");

module.exports.readTasks = async (req, res) => {
  const match = {};
  const sort = {};  
  if(req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: req.query.limit*1,
        skip: req.query.skip*1,
        sort
      }
    }).execPopulate();
    res.status(200).json(req.user.tasks);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.readTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, author: req.user._id });
    if(!task) {
      return res.status(404).send();
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports.createTask = async (req, res) => {
  const task = new Task({ ...req.body, author: req.user._id });
  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ["description", "completed"];
  const isValidate = updates.every(update => validUpdates.includes(update));
  if (!isValidate) {
    return res.status(404).json({ error: "Invalid update!" });
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, author: req.user._id });
    if(!task) {
      return res.status(404).send();
    }
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndRemove({ _id: req.params.id, author: req.user._id });
    if(!task) {
      return res.status(404).send();
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).send();
  }
};