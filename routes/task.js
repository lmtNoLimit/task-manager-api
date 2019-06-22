const express = require("express");
const router = express.Router();
const {
  createTask,
  readTasks,
  readTask,
  updateTask,
  deleteTask
} = require("../controllers/task");

router.get("/", readTasks);
router.post("/", createTask);
router.get("/:id", readTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
