const prisma = require("../config/prisma");

exports.getAll = async (filters = {}) => {

    const where = {};

    if (filters.status && filters.status !== "ALL") {
        where.status = filters.status;
    }

    if (filters.search) {
        where.OR = [
            {
                title: {
                    contains: filters.search,
                    mode: "insensitive"
                }
            },
            {
                excerpt: {
                    contains: filters.search,
                    mode: "insensitive"
                }
            }
        ];
    }

    return prisma.blog.findMany({
        where,
        include: {
            category: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });

};

exports.getById = async (id) => {

    return prisma.blog.findUnique({

        where: { id },

        include: {
            category: true
        }

    });

};

exports.getBySlug = async (slug) => {

    return prisma.blog.findUnique({

        where: { slug },

        include: {
            category: true
        }

    });

};

exports.getPublished = async (
    type,
    page = 1,
    limit = 6
) => {

    const skip = (page - 1) * limit;

    const where = {
        status: "PUBLISHED",
        type
    };

    const [items, total] = await Promise.all([

        prisma.blog.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                publishedAt: "desc"
            }
        }),

        prisma.blog.count({
            where
        })

    ]);

    return {

        items,

        total,

        page,

        totalPages: Math.ceil(total / limit)

    };

};

exports.slugExists = async (slug, ignoreId = null) => {

    const blog = await prisma.blog.findFirst({

        where: {

            slug,

            ...(ignoreId && {

                NOT: {

                    id: ignoreId

                }

            })

        }

    });

    return !!blog;

};

exports.getCategories = async () => {

    return prisma.blogCategory.findMany({

        orderBy: {

            name: "asc"

        }

    });

};

exports.create = async (data) => {

    return prisma.blog.create({

        data

    });

};

exports.update = async (id, data) => {

    return prisma.blog.update({

        where: {
            id
        },

        data

    });

};

exports.delete = async (id) => {

    return prisma.blog.delete({

        where: {
            id
        }

    });

};

exports.updateStatus = async (id, status) => {

    const blog = await prisma.blog.findUnique({
        where: { id }
    });

    return prisma.blog.update({

        where: { id },

        data: {

            status,

            publishedAt:
                status === "PUBLISHED"
                    ? blog.publishedAt || new Date()
                    : blog.publishedAt

        }

    });

};

exports.getFeatured = async (type = "BLOG") => {

    return prisma.blog.findMany({

        where: {

            status: "PUBLISHED",

            featured: true,

            type

        },

        include: {

            category: true

        },

        take: 3,

        orderBy: {

            publishedAt: "desc"

        }

    });

};

exports.getPublishedBySlug = async (slug) => {

    return prisma.blog.findFirst({

        where: {
            slug,
            status: "PUBLISHED"
        },

        include: {
            category: true
        }

    });

};