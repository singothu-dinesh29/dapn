const Project = require('../models/Project');

// DUMMY DATA FOR OFFLINE MODE
const MOCK_PROJECTS = [
    {
        _id: 'p1',
        title: 'MNC Corporate Rebrand',
        category: 'Graphic',
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800',
        creatorId: { name: 'Dinesh', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
        description: 'Premium branding for a multinational corporation.'
    },
    {
        _id: 'p2',
        title: 'Elite Creator Hub',
        category: 'Development',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        creatorId: { name: 'Sunny', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
        description: 'A full-stack ecosystem for creative professionals.'
    },
    {
        _id: 'p3',
        title: 'Cinematic Portfolio',
        category: 'Video',
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
        creatorId: { name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
        description: 'High-end video production for luxury brands.'
    }
];

// @desc    Get all projects
exports.getProjects = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            return res.status(200).json({ success: true, count: MOCK_PROJECTS.length, data: MOCK_PROJECTS });
        }

        const { category } = req.query;
        let query = {};
        if (category) query.category = category;

        const projects = await Project.find(query).populate('creatorId', 'name avatar');
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new project
exports.createProject = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            return res.status(201).json({ success: true, data: { ...req.body, _id: Date.now().toString() } });
        }
        req.body.creatorId = req.user._id;
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ... other methods follow the same pattern if needed
exports.getProject = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            const project = MOCK_PROJECTS.find(p => p._id === req.params.id) || MOCK_PROJECTS[0];
            return res.status(200).json({ success: true, data: project });
        }
        const project = await Project.findById(req.params.id).populate('creatorId', 'name avatar bio');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    res.status(200).json({ success: true, message: 'Project removed (Demo Mode)' });
};
