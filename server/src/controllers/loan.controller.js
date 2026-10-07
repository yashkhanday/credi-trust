const {
  getLoans,
  getLoanById,
} = require("../services/loan/loan.service");

async function listLoans(req, res) {
  try {
    const loans = await getLoans();

    return res.status(200).json({
      success: true,
      count: loans.length,
      loans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch loan offers",
    });
  }
}

async function getLoan(req, res) {
  try {
    const loan = await getLoanById(req.params.id);

    return res.status(200).json({
      success: true,
      loan,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to fetch loan offer",
    });
  }
}

module.exports = {
  listLoans,
  getLoan,
};
