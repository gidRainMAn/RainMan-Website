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

        const blog = await blogService.getPublishedBlogBySlug(req.params.slug);

        if (!blog) {
            return res.status(404).render("error/404");
        }

        res.render("pages/resource-detail", {
            title: blog.seoTitle || blog.title,
            description: blog.seoDescription || blog.excerpt,
            canonical: `/resources/${blog.slug}`,
            currentPage: "resources",
            blog
        });

    } catch (err) {
        next(err);
    }

};