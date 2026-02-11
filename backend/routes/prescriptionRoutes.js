const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { analyzePrescription } = require("../controller/prescriptionController");

// Multer configuration for prescription uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "prescription-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for prescriptions
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp|gif|bmp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (JPEG, PNG, WebP, GIF, BMP) are allowed!"), false);
        }
    },
});

// POST /api/prescription/analyze - Analyze prescription image
router.post("/analyze", upload.single("prescription"), analyzePrescription);

module.exports = router;
