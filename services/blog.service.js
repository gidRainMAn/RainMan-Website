const blogRepository = require("../repositories/blog.repository");

// ---------------------------
// Helpers
// ---------------------------

const generateSlug = (title) => {

    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

};

const getUniqueSlug = async (slug, ignoreId = null) => {

    let uniqueSlug = slug;
    let counter = 2;

    while (await blogRepository.slugExists(uniqueSlug, ignoreId)) {

        uniqueSlug = `${slug}-${counter}`;
        counter++;

    }

    return uniqueSlug;

};

// ---------------------------
// Queries
// ---------------------------

exports.getBlogs = async (filters = {}) => {

    return blogRepository.getAll(filters);

};

exports.getBlog = async (id) => {

    return blogRepository.getById(id);

};

// exports.getPublishedBlogs = async () => {

//     return blogRepository.getPublished();

// };

exports.getPublishedResources = (
    type,
    page = 1,
    limit = 6
) => {

    return blogRepository.getPublished(
        type,
        page,
        limit
    );

};

exports.getBlogBySlug = async (slug) => {

    return blogRepository.getBySlug(slug);

};

exports.getCategories = async () => {

    return blogRepository.getCategories();

};

// ---------------------------
// Commands
// ---------------------------

exports.createBlog = async (data) => {

    const slug = await getUniqueSlug(
        data.slug?.trim() || generateSlug(data.title)
    );

    return blogRepository.create({

        ...data,

        type: data.type || "BLOG",

        slug,
        featured: data.featured === "true",
        publishedAt:
            data.status === "PUBLISHED"
                ? new Date()
                : null

    });

};

exports.updateBlog = async (id, data) => {

    const slug = await getUniqueSlug(
        data.slug?.trim() || generateSlug(data.title),
        id
    );

    return blogRepository.update(id, {

        ...data,

        type: data.type || "BLOG",

        slug,
        featured: data.featured === "true",
        publishedAt:
            data.status === "PUBLISHED"
                ? new Date()
                : null

    });

};

exports.deleteBlog = async (id) => {

    return blogRepository.delete(id);

};

exports.updateStatus = async (id, status) => {

    return blogRepository.updateStatus(id, status);

};

exports.getFeaturedBlogs = async () => {

    return blogRepository.getFeatured();

};

exports.getPublishedBlogBySlug = (slug) => {
    return blogRepository.getPublishedBySlug(slug);
};