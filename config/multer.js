const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(
    __dirname,
    "../public/uploads/blogs/banners"
);

fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadPath);

    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

        cb(
            null,
            Date.now() + ext
        );

    }

});

module.exports = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter(req, file, cb) {

        if (
            file.mimetype.startsWith("image/")
        ) {

            cb(null, true);

        } else {

            cb(new Error("Only images allowed"));

        }

    }

});