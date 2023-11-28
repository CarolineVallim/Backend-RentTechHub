const express = require('express');

const router = express.Router();

const Task = require('../models/Task.model');
const Project = require('../models/Project.model');

// POST '/api/:projectId/tasks' - Creates a new projects' task
router.post('/:projectId/tasks', (req,res)=>{
    const {projectId} = req.params;
    const {title, description} = req.body; 

    Task.create({title, description, project: projectId})
    .then((newTask)=>{
        return Project.findByIdAndUpdate(projectId, {
            $push: {tasks: newTask._id}
        })
    })
    .then((response)=> res.json(response))
    .catch((error)=> res.json(error))
})

module.exports = router;