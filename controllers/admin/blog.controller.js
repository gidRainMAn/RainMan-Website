const blogService = require("../../services/blog.service");
const { validationResult } = require("express-validator");

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
            title: "Resources",
            pageCSS: "admin-blog",
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
            title: "Create Resource",
            categories,
            blog: null,
            errors: {}
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
        const errors = validationResult(req);
        // console.log(errors.array());
        if (!errors.isEmpty()) {

            const categories = await blogService.getCategories();

            return res.status(400).render("admin/blogs/create", {
                layout: "layouts/admin",
                title: "Create Blog",
                categories,
                errors: errors.mapped(),
                blog: req.body,
                // debug: true
            });

        }

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
            
            title: "Edit Resource",
            
            blog,
            categories,
            errors: {}
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

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const blog = await blogService.getBlog(req.params.id);

            const categories = await blogService.getCategories();

            return res.status(400).render("admin/blogs/edit", {

                layout: "layouts/admin",

                title: "Edit Resource",

                blog: {

                    ...blog,

                    ...req.body

                },

                categories,

                errors: errors.mapped()

            });

        }

        if (req.file) {

            req.body.bannerImage =
                "/uploads/blogs/banners/" + req.file.filename;

        }

        await blogService.updateBlog(

            req.params.id,

            req.body

        );

        res.redirect("/admin/blogs");

    }

    catch (error) {

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