const express = require("express");
const router = express.Router();

const pageController = require("../controllers/pageController");
const resourcesController = require("../controllers/resources.controller");

router.get("/", pageController.home);
router.get("/team", pageController.team);
router.get("/methodology", pageController.methodology);
router.get("/services", pageController.services);
router.get("/products", pageController.products);
router.get("/resources", pageController.resources);
router.get("/contact", pageController.contact);

router.get("/resources", resourcesController.index);
router.get("/resources/:slug",resourcesController.detail);

module.exports = router;