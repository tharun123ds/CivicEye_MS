require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));

// DB + Server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('User-Auth DB connected');
        app.listen(4001, () =>
            console.log('User-Auth Service running on port 4001')
        );
    })
    .catch(err => {
        console.error('DB connection failed:', err.message);
    });
