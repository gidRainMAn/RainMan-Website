const rateLimit = require("express-rate-limit");

const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,                 // 5 submissions per IP
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many contact requests. Please try again later."
    }
});

module.exports = contactRateLimiter;