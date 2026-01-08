const express = require("express");
const router = express.Router();
const { Gettractionlist, Addtraction, Updatetraction, Deletetracction } = require("../controllers/addTrastion");
const { authenticateToken } = require("../middleware/auth");

// Get all transactions
router.get("/", authenticateToken, Gettractionlist);

// Add new transaction
router.post("/", authenticateToken, Addtraction);

// Update transaction
router.put("/:id", authenticateToken, Updatetraction);

// Delete transaction
router.delete("/:id", authenticateToken, Deletetracction);

module.exports = router;
