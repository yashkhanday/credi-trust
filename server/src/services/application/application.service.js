const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const { getKycByUserId } = require("../kyc/kyc.service");

const applicationsFile = path.join(
  __dirname,
  "../../../data/applications.json"
);

async function getApplications() {
  const data = await fs.readFile(applicationsFile, "utf8");

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("applications.json contains invalid JSON");
  }
}

async function saveApplications(applications) {
  await fs.writeFile(
    applicationsFile,
    JSON.stringify(applications, null, 2),
    "utf8"
  );
}

async function createApplication({
  userId,
  loanId,
  loanName,
  amount,
  tenureMonths,
  monthlyIncome,
  employmentType,
}) {
  const applications = await getApplications();

  const kyc = await getKycByUserId(userId);

  // Development rule:
  // Loan application is allowed only after KYC is verified.
  if (kyc.overallStatus !== "verified") {
    const error = new Error(
      "Please complete and verify your KYC profile before applying for a loan"
    );

    error.statusCode = 400;
    throw error;
  }

  const application = {
    id: `APP-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    userId,
    loanId,
    loanName,
    amount: Number(amount),
    tenureMonths: Number(tenureMonths),
    monthlyIncome: Number(monthlyIncome),
    employmentType,
    kycStatus: kyc.overallStatus,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  applications.push(application);

  await saveApplications(applications);

  return application;
}

async function getApplicationsByUser(userId) {
  const applications = await getApplications();

  return applications.filter(
    (application) => application.userId === userId
  );
}

async function getAllApplications() {
  return getApplications();
}

async function updateApplicationStatus(applicationId, status) {
  const applications = await getApplications();

  const application = applications.find(
    (item) => item.id === applicationId
  );

  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  application.status = status;
  application.updatedAt = new Date().toISOString();

  await saveApplications(applications);

  return application;
}

module.exports = {
  createApplication,
  getApplicationsByUser,
  getAllApplications,
  updateApplicationStatus,
};
