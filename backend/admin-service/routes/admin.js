const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// ================= MIDDLEWARE =================

// Protect all admin routes
router.use(auth);

// ================= ROUTES =================

// GET ALL ISSUES (Admin Dashboard)
router.get('/issues', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:4002/issues/admin/all',
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch issues' });
    }
});

// UPDATE ISSUE STATUS
router.patch('/issues/:id', async (req, res) => {
    try {
        const response = await axios.patch(
            `http://localhost:4002/issues/${req.params.id}`,
            { status: req.body.status },
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update issue' });
    }
});

// DELETE ISSUE
router.delete('/issues/:id', async (req, res) => {
    try {
        const response = await axios.delete(
            `http://localhost:4002/issues/${req.params.id}`,
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete issue' });
    }
});

module.exports = router;
