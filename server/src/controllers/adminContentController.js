const Content = require('../models/Content');

/**
 * @desc    Add New Creative Content
 * @route   POST /api/admin/content/add
 * @access  Private/Admin
 */
exports.addContent = async (req, res) => {
    try {
        const { title, type, fileUrl, externalLink, description } = req.body;

        // 1. Validation
        if (!title || !type || !fileUrl) {
            return res.status(400).json({
                success: false,
                message: 'Title, Type, and File URL are mandatory'
            });
        }

        // 2. Create Content Record
        const contentData = {
            title,
            type,
            fileUrl,
            externalLink,
            description
        };

        // If authorized via real JWT, attach creator. 
        // If via Bypass, we save as 'System Master'
        if (req.admin?.id || req.user?.id) {
            contentData.creatorId = req.admin?.id || req.user?.id;
        } else {
            // For bypass mode, we skip creatorId or use a placeholder if needed
            // But we must ensure the model allows it. I will update the model next.
        }

        const content = await Content.create(contentData);

        res.status(201).json({
            success: true,
            message: 'Content successfully added to the ecosystem',
            data: content
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'CMS Error: Could not save content',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Portfolio Content
 * @route   GET /api/admin/content/all
 * @access  Private/Admin
 */
exports.getAllContent = async (req, res) => {
    try {
        // Fetch all content, sorted by newest first
        const contents = await Content.find({})
            .sort('-createdAt')
            .populate('creatorId', 'name email');

        res.status(200).json({
            success: true,
            count: contents.length,
            data: contents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'CMS Error: Could not retrieve content',
            error: error.message
        });
    }
};
