const fs = require("fs/promises");
const path = require("path");

const loansFile = path.join(__dirname, "../../../data/loans.json");

async function getLoans() {
  const data = await fs.readFile(loansFile, "utf8");
  return JSON.parse(data);
}

async function getLoanById(loanId) {
  const loans = await getLoans();

  const loan = loans.find((item) => item.id === loanId);

  if (!loan) {
    const error = new Error("Loan offer not found");
    error.statusCode = 404;
    throw error;
  }

  return loan;
}

module.exports = {
  getLoans,
  getLoanById,
};
