"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
const multer = require("multer");
const path_1 = require("path");
exports.multerOptions = {
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            cb(null, Date.now() + (0, path_1.extname)(file.originalname));
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};
//# sourceMappingURL=multer.config.js.map