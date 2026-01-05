import Task from "../models/task.js";

// create task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task, { message: "success in create task" });
  } catch (error) {
    res.status(500).json({ message: "fail in create task" });
  }
};

// read aLL tasks
export const readAllTask = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const tasks = await Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Task.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({page, limit, total, totalPages, tasks});
  } catch (error) {
    res.status(500).json({ message: "Error in getting tasks" });
    
  }
};

// read single task
export const readSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error in getting task" });
  }
};

// update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(task, { message: "Success in updating task" });
  } catch (error) {
    res.status(500).json({ message: "Error in updating task" });
  }
};

// delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "delete success task" });
  } catch (error) {
    res.status(500).json({ message: "Error in deleting task" });
  }
};
