const { body } = require("express-validator");

const blogValidationRules = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required."),

    body("excerpt")
        .trim()
        .notEmpty()
        .withMessage("Excerpt is required."),

    body("contentHtml")
        .trim()
        .notEmpty()
        .withMessage("Content is required."),

    body("categoryId")
        .notEmpty()
        .withMessage("Category is required."),

    body("seoTitle")
        .optional({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage("SEO title should not exceed 60 characters."),

    body("seoDescription")
        .optional({ checkFalsy: true })
        .isLength({ max: 160 })
        .withMessage("SEO description should not exceed 160 characters.")
];

module.exports = {
    validateCreateBlog: blogValidationRules,
    validateUpdateBlog: blogValidationRules
};