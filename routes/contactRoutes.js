const express = require("express");
const router = express.Router();

const {
    sendContactEmail
} = require("../controllers/contactsController");

const contactRateLimiter = require("../middleware/contactRateLimiter");

router.post("/contact", contactRateLimiter, sendContactEmail);

module.exports = router;