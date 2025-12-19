require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ENSURE UPLOADS DIR =================
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

// ================= STATIC FILES =================
app.use('/uploads', express.static(uploadsPath));

// ================= ROUTES =================
app.use('/issues', require('./routes/issue'));

// ================= DB + SERVER =================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Issue DB connected');
        app.listen(4002, () => {
            console.log('Issue Service running on port 4002');
        });
    })
    .catch(err => console.error('DB connection failed:', err));
