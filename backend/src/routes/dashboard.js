const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getDashboardSummary
} = require("../controllers/dashboardController");

const router = express.Router();

router.get(
    "/summary",
    authMiddleware,
    getDashboardSummary
);

module.exports = router;