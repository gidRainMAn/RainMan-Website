const express = require("express");

const router = express.Router();

const authController = require("../controllers/admin/auth.controller");
const dashboardController = require("../controllers/admin/dashboard.controller");
const blogController = require("../controllers/admin/blog.controller");

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../config/multer");

const {
    validateCreateBlog,
    validateUpdateBlog
} = require("../middleware/validation/blog.validation");

console.log("Auth:", authController);
console.log("Dashboard:", dashboardController);
console.log("Blog:", blogController);

// =======================================
// Authentication
// =======================================

router.get("/login", authController.loginPage);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

// =======================================
// Protected Routes
// =======================================

router.use(authMiddleware);

// Dashboard

router.get(
    "/dashboard",
    dashboardController.index
);

// =======================================
// Blogs
// =======================================

// List
router.get(
    "/blogs",
    blogController.index
);

// Create Page
router.get(
    "/blogs/create",
    blogController.createPage
);

// Create Blog
router.post(
    "/blogs/create",
    upload.single("banner"),
    validateCreateBlog,
    blogController.create
);

// Edit
router.get(
    "/blogs/edit/:id",
    blogController.editPage
);

router.post(
    "/blogs/edit/:id",
    upload.single("banner"),
    validateUpdateBlog,
    blogController.update
);

// Delete
router.post(
    "/blogs/delete/:id",
    blogController.delete
);

// Status (Publish / Draft / Archive)
router.post(
    "/blogs/status/:id",
    blogController.updateStatus
);

module.exports = router;