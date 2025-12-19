const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

const createToken = (user) =>
    jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exists = await User.findOne({ username });
        if (exists)
            return res.status(400).json({ message: 'Username already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });

        const token = createToken(user);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = createToken(user);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = router;
