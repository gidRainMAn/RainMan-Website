const express = require("express");
const router = express.Router();

const pageController = require("../controllers/pageController");

router.get("/", pageController.home);
router.get("/team", pageController.team);
router.get("/methodology", pageController.methodology);
router.get("/services", pageController.services);
router.get("/products", pageController.products);
router.get("/resources", pageController.resources);
router.get("/contact", pageController.contact);

module.exports = router;