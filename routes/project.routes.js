/* Require NPM Packages */
const express = require("express");
const mongoose = require("mongoose");

/* Configure an Express Router for the Project Routes */
const router = express.Router();

/* Require the Project Model */
const Project = require("../models/Project.model");

/* ROUTES */

// POST '/api/project' - Creates a new proejct
router.post("/project", (req, res) => {
  const { title, description } = req.body;

  Project.create({ title, description, tasks: [] })
    .then((response) => res.json(response))
    .catch((error) => res.json(error));
});

// GET '/api/projects' - Reads all projects
router.get("/projects", (req, res) => {
  Project.find()
    .populate('tasks')
    .then((allProjects) => res.json(allProjects))
    .catch((error) => res.json(error));
});

// GET '/api/projects/:projectId' - Reads a specific project
router.get("/projects/:projectId", (req, res) => {
  const { projectId } = req.params;
  Project.findById(projectId)
    .populate('tasks')
    .then((project) => res.json(project))
    .catch((error) => res.json(error));
});

// PUT '/api/projects/:projectId' - Updates a specific project
router.put("/projects/:projectId", (req, res) => {
  // Object destructuring
  const { projectId } = req.params;
  const { title, description } = req.body;

  Project.findByIdAndUpdate(projectId, { title, description }, { new: true })
    .then(() => {
      res.json({ message: "Project Updated!" });
    })
    .catch((error) => {
      res.json({ message: "Failed to Update Project." });
    });
});

// DELETE '/api/projects/:projectId' - Deletes a specific project
router.delete('/projects/:projectId', (req,res)=>{
    const {projectId} = req.params; 

    Project.findByIdAndDelete(projectId)
        .then(()=>{
            res.json({message: 'Project deleted'});
        })
        .catch(()=>{
            res.json({error: 'Failed to delete a Project'});
        })
})

/* Export the router */
module.exports = router;
