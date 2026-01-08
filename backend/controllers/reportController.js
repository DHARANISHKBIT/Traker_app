const Transaction = require("../modules/tranctionModule");
// const PDFDocument = require("pdfkit");

// Get monthly report data
const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        categoryBreakdown[transaction.category] =
          (categoryBreakdown[transaction.category] || 0) + transaction.amount;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        summary: {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        },
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error("Get monthly report error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch monthly report",
    });
  }
};

// Export PDF report
const exportPDF = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch transactions for the selected month
    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });

    // Calculate summary
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Calculate category breakdown
    const categoryBreakdown = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        categoryBreakdown[transaction.category] =
          (categoryBreakdown[transaction.category] || 0) + transaction.amount;
      }
    });

    // Create PDF document
    // const doc = new PDFDocument({
    //   margin: 50,
    //   size: "A4",
    // });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=expense-report-${year}-${String(month).padStart(2, "0")}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text("Expense Tracker Report", { align: "center" })
      .moveDown();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    doc
      .fontSize(16)
      .text(
        `${monthNames[month - 1]} ${year}`,
        { align: "center" }
      )
      .moveDown(2);

    // Summary Section
    doc.fontSize(14).text("Summary", { underline: true }).moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`);
    doc.text(`Balance: $${balance.toFixed(2)}`, {
      color: balance >= 0 ? "#00AA00" : "#AA0000",
    });
    doc.moveDown(2);

    // Category Breakdown
    if (Object.keys(categoryBreakdown).length > 0) {
      doc.fontSize(14).text("Expense by Category", { underline: true }).moveDown(0.5);
      doc.fontSize(12);
      Object.entries(categoryBreakdown)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, amount]) => {
          doc.text(`${category}: $${amount.toFixed(2)}`);
        });
      doc.moveDown(2);
    }

    // Transactions List
    doc.fontSize(14).text("Transactions", { underline: true }).moveDown(0.5);

    if (transactions.length === 0) {
      doc.fontSize(12).text("No transactions found for this month.");
    } else {
      // Table header
      let yPosition = doc.y;
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Date", 50, yPosition)
        .text("Type", 120, yPosition)
        .text("Category", 180, yPosition)
        .text("Description", 280, yPosition, { width: 150 })
        .text("Amount", 450, yPosition, { align: "right" })
        .moveDown(0.3);

      // Draw line
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

      doc.moveDown(0.5);

      // Transactions rows
      doc.font("Helvetica");
      transactions.forEach((transaction) => {
        const date = new Date(transaction.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        // Check if we need a new page
        if (doc.y > 700) {
          doc.addPage();
          yPosition = 50;
        } else {
          yPosition = doc.y;
        }

        doc
          .fontSize(9)
          .text(date, 50, yPosition, { width: 70 })
          .text(
            transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
            120,
            yPosition,
            { width: 60, color: transaction.type === "income" ? "#00AA00" : "#AA0000" }
          )
          .text(transaction.category, 180, yPosition, { width: 100 })
          .text(transaction.description, 280, yPosition, { width: 150 })
          .text(
            `$${transaction.amount.toFixed(2)}`,
            450,
            yPosition,
            { width: 100, align: "right" }
          )
          .moveDown(0.5);
      });
    }

    // Footer
    doc
      .fontSize(8)
      .text(
        `Generated on ${new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`,
        50,
        750,
        { align: "center" }
      );

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Export PDF error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to export PDF",
      });
    }
  }
};

// Export Excel report (placeholder - would need xlsx package)
const exportExcel = async (req, res) => {
  try {
    // For now, return a message that Excel export is not yet implemented
    // You can implement this using the 'xlsx' package if needed
    res.status(501).json({
      success: false,
      message: "Excel export is not yet implemented",
    });
  } catch (error) {
    console.error("Export Excel error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to export Excel",
    });
  }
};

module.exports = {
  getMonthlyReport,
  exportPDF,
  exportExcel,
};
