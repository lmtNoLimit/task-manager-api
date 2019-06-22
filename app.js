require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const authRouter = require('./routes/auth');
const { auth } = require('./middleware/auth');

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connected"));

app.use(express.json());

// use route
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/tasks", auth, taskRouter);

app.listen(port, () => console.log(`Server is listening on port ${port}`));