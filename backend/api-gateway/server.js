require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
app.use(cors());

// ❌ DO NOT USE express.json() globally for file uploads
// app.use(express.json());  <-- REMOVE THIS

// ================= AUTH SERVICE =================
app.use(
    '/auth',
    proxy('http://localhost:4001', {
        proxyReqPathResolver: (req) => `/auth${req.url}`,
        limit: '50mb',
    })
);

// ================= ISSUE SERVICE =================
app.use(
    '/issues',
    proxy('http://localhost:4002', {
        proxyReqPathResolver: (req) => `/issues${req.url}`,
        limit: '50mb',

        // 🔥 CRITICAL: stream body instead of parsing
        parseReqBody: false,
    })
);

// ================= STATIC UPLOADS =================
app.use(
    '/uploads',
    proxy('http://localhost:4002', {
        proxyReqPathResolver: (req) => `/uploads${req.url}`,
    })
);

// ================= ADMIN SERVICE =================
app.use(
    '/admin',
    proxy('http://localhost:4003', {
        proxyReqPathResolver: (req) => `/admin${req.url}`,
        limit: '50mb',
        parseReqBody: false,
    })
);

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
