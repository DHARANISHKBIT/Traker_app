const { addTransaction, getTransactions, updateTransaction, deleteTransaction } = require("../services/tractionServices");

// Add a new transaction
const Addtraction = async (req, res) => {
  try {
    const data = {
      ...req.body,
      amount: Number(req.body.amount),
      userId: req.user?._id,
    };

    const saved = await addTransaction(data);

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Add transaction error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to add transaction",
      error: "ADD_TRANSACTION_FAILED",
    });
  }
};

// Get list of transactions (for current user if available)
const Gettractionlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    const list = await getTransactions(userId);

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: list,
    });
  } catch (err) {
    console.error("Get transactions error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch transactions",
      error: "GET_TRANSACTIONS_FAILED",
    });
  }
};

module.exports = { Addtraction, Gettractionlist };

// Update transaction
const Updatetraction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const data = {
      ...req.body,
      amount: req.body.amount != null ? Number(req.body.amount) : undefined,
    };

    const updated = await updateTransaction(id, data, userId);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update transaction error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update transaction",
      error: "UPDATE_TRANSACTION_FAILED",
    });
  }
};

// Delete transaction
const Deletetracction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    await deleteTransaction(id, userId);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.error("Delete transaction error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to delete transaction",
      error: "DELETE_TRANSACTION_FAILED",
    });
  }
};

module.exports = { Addtraction, Gettractionlist, Updatetraction, Deletetracction };