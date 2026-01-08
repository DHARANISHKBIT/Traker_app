const express = require("express");
const router = express.Router();
const {
  getMonthlyReport,
  exportPDF,
  exportExcel,
} = require("../controllers/reportController");
const { authenticateToken } = require("../middleware/auth");

// Get monthly report
router.get("/monthly", authenticateToken, getMonthlyReport);

// Export PDF report
router.get("/export/pdf", authenticateToken, exportPDF);

// Export Excel report
router.get("/export/excel", authenticateToken, exportExcel);

module.exports = router;
