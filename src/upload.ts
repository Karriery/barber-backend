import { join } from "path";

const multer = require("multer");
const path = require("path");

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(process.cwd(), "upload/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const storageStatic = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(process.cwd(), "client/assets/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
