const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = new express.Router();

//Create Task route
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Fetch Task
router.get("/tasks", auth, async (req, res) => {
  try {
    const match = { owner: req.user._id };
    const sort = {};
    if (req.query.completed) {
      // /tasks?completed=true&limit=2&skip=0
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      var sortingCredentials = req.query.sortBy.split("_");
      sort[sortingCredentials[0].trim()] =
        sortingCredentials[1].trim() === "desc" ? -1 : 1;
    }
    const tasks = await Task.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip) * parseInt(req.query.limit))
      .sort(sort); // mongoose will take care if limit is not provided or isn't integer
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findById(req.params.id);  it will not let us add owner parameter to verify that the user the task belongs to loggedin user.

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  updates = Object.keys(req.body);
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", auth, (req, res) => {
  try {
    const task = Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
