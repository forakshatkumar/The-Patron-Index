const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createScan,
    getScan,
    uploadScan
} = require("../controllers/scanController");

const router = express.Router();

router.post("/", authMiddleware, createScan);

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadScan
);

router.get("/:id", authMiddleware, getScan);

module.exports = router;