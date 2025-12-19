const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    photo: String,
    status: { type: String, default: 'Pending' },
    createdBy: { type: String }, // userId from JWT
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', issueSchema);
