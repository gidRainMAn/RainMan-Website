const blogService = require("../services/blog.service");

exports.index = async (req, res, next) => {

    try {

        const blogs = await blogService.getPublishedBlogs();

        res.render("resources/index", {

            title: "Resources",

            blogs

        });

    } catch (error) {

        next(error);

    }

};

exports.detail = async (req, res, next) => {

    try {

        const blog = await blogService.getBlogBySlug(req.params.slug);

        if (!blog || blog.status !== "PUBLISHED") {

            return res.status(404).render("error/404");

        }

        res.render("resources/detail", {

            title: blog.title,

            blog

        });

    } catch (error) {

        next(error);

    }

};