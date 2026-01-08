const Transaction = require("../modules/tranctionModule");

// Create a new transaction in MongoDB
const addTransaction = async (data) => {
  if (!data.type || !data.category || data.amount == null || !data.date || !data.description) {
    throw new Error("All transaction fields are required");
  }

  if (!["income", "expense"].includes(data.type)) {
    throw new Error("Transaction type must be 'income' or 'expense'");
  }

  const transaction = new Transaction({
    type: data.type,
    category: data.category,
    amount: data.amount,
    date: data.date,
    description: data.description,
    userId: data.userId,
  });

  const saved = await transaction.save();
  return saved;
};

// Get transactions, optionally filtered by user
const getTransactions = async (userId) => {
  const query = userId ? { userId } : {};
  const list = await Transaction.find(query).sort({ date: -1 });
  return list;
};

// Update transaction by id
const updateTransaction = async (id, data, userId) => {
  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (data.type && !["income", "expense"].includes(data.type)) {
    throw new Error("Transaction type must be 'income' or 'expense'");
  }

  if (data.type !== undefined) transaction.type = data.type;
  if (data.category !== undefined) transaction.category = data.category;
  if (data.amount !== undefined) transaction.amount = data.amount;
  if (data.date !== undefined) transaction.date = data.date;
  if (data.description !== undefined) transaction.description = data.description;

  const saved = await transaction.save();
  return saved;
};

// Delete transaction by id
const deleteTransaction = async (id, userId) => {
  const result = await Transaction.findOneAndDelete({ _id: id, userId });
  if (!result) {
    throw new Error("Transaction not found");
  }
  return result;
};

module.exports = { addTransaction, getTransactions, updateTransaction, deleteTransaction };
