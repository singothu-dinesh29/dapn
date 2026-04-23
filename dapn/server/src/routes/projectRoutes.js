const express = require('express');
const router = express.Router();
const { 
    getProjects, 
    createProject, 
    getProject, 
    deleteProject 
} = require('../controllers/projectController');
const { protect, creator } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, creator, createProject);

router.route('/:id')
    .get(getProject)
    .delete(protect, creator, deleteProject);

module.exports = router;
