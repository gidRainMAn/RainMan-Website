const express = require("express");
const router = express.Router();

const {
    sendContactEmail
} = require("../controllers/contactsController");

router.post("/contact", sendContactEmail);

module.exports = router;