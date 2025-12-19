const express = require('express');
const multer = require('multer');
const path = require('path');
const Issue = require('../models/issue');
const auth = require('../middleware/auth');

const router = express.Router();

// ================= UPLOAD CONFIG =================

// Absolute uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// ================= MIDDLEWARE =================

// Protect all routes
router.use(auth);

// ================= ROUTES =================

// CREATE ISSUE (User)
router.post('/', upload.single('photo'), async (req, res) => {
    const { title, description, location } = req.body;

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const issue = await Issue.create({
        title,
        description,
        location,
        photo,
        createdBy: req.user.id
    });

    res.json(issue);
});

// GET OWN ISSUES (User)
router.get('/', async (req, res) => {
    const issues = await Issue.find({
        createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(issues);
});

// GET ALL ISSUES (Admin only)
router.get('/admin/all', async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
});

// UPDATE ISSUE STATUS (Admin only)
router.patch('/:id', async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const issue = await Issue.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );

    res.json(issue);
});

// DELETE ISSUE (Admin only)
router.delete('/:id', async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can delete issues' });
    }

    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({ message: 'Issue deleted successfully' });
});

module.exports = router;
