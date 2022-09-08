const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = new express.Router();

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

//Creating GET route

router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({owner:req.user._id});
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {

    // const task = await Task.findById(req.params.id);  it will not let us add owner parameter to verify that the user the task belongs to loggedin user.

    const  task = await Task.findOne({_id:req.params.id, owner: req.user._id });
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
    const task = await Task.findOne({_id:req.params.id, owner: req.user._id});
    
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

router.delete("/tasks/:id",auth, (req, res) => {
  try {
    const task = Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
