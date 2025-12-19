require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.use('/admin', require('./routes/admin'));

app.listen(4003, () => {
    console.log('Admin Service running on port 4003');
});
