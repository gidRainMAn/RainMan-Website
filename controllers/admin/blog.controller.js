const blogService = require("../../services/blog.service");

// =====================================
// Blog List
// =====================================

exports.index = async (req, res, next) => {

    try {

        const filters = {
            search: req.query.search || "",
            status: req.query.status || "ALL"
        };

        const blogs = await blogService.getBlogs(filters);

        res.render("admin/blogs/index", {
            layout: "layouts/admin",
            title: "Blogs",
            blogs,
            filters
        });

    } catch (error) {
        next(error);
    }

};

// =====================================
// Create Page
// =====================================

exports.createPage = async (req, res, next) => {

    try {

        const categories = await blogService.getCategories();

        res.render("admin/blogs/create", {
            layout: "layouts/admin",
            title: "Create Blog",
            categories
        });

    } catch (error) {
        next(error);
    }

};

// =====================================
// Create Blog
// =====================================

exports.create = async (req, res, next) => {

    try {

        if (req.file) {
            req.body.bannerImage = "/uploads/blogs/banners/" + req.file.filename;
        }

        await blogService.createBlog(req.body);

        res.redirect("/admin/blogs");

    } catch (error) {
        next(error);
    }

};

// =====================================
// Edit Page
// =====================================

exports.editPage = async (req, res, next) => {

    try {

        const blog = await blogService.getBlog(req.params.id);

        if (!blog) {
            return res.status(404).render("error/404");
        }

        const categories = await blogService.getCategories();

        res.render("admin/blogs/edit", {

            layout: "layouts/admin",

            title: "Edit Blog",

            blog,

            categories

        });

    } catch (error) {

        next(error);

    }

};

// =====================================
// Update Blog
// =====================================

exports.update = async (req, res, next) => {

    try {

        if (req.file) {
            req.body.bannerImage = "/uploads/blogs/banners/" + req.file.filename;
        }

        await blogService.updateBlog(
            req.params.id,
            req.body
        );

        res.redirect("/admin/blogs");

    } catch (error) {
        next(error);
    }

};

// =====================================
// Delete Blog
// =====================================

exports.delete = async (req, res, next) => {

    try {

        await blogService.deleteBlog(req.params.id);

        res.redirect("/admin/blogs");

    } catch (error) {

        next(error);

    }

};

// =====================================
// Update Status
// =====================================

exports.updateStatus = async (req, res, next) => {

    try {

        await blogService.updateStatus(

            req.params.id,

            req.body.status

        );

        res.redirect("/admin/blogs");

    } catch (error) {

        next(error);

    }

};