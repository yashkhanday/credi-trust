const fs = require("fs/promises");
const path = require("path");

const kycFile = path.join(__dirname, "../../../data/kyc.json");
const usersFile = path.join(__dirname, "../../../data/users.json");

async function readJson(file) {
  const data = await fs.readFile(file, "utf8");

  try {
    return JSON.parse(data);
  } catch {
    throw new Error(`Invalid JSON file: ${file}`);
  }
}

async function writeKyc(records) {
  await fs.writeFile(
    kycFile,
    JSON.stringify(records, null, 2),
    "utf8"
  );
}

async function getAllKycReviews() {
  const kycRecords = await readJson(kycFile);
  const users = await readJson(usersFile);

  return kycRecords.map((kyc) => {
    const user = users.find(
      (item) => item.id === kyc.userId
    );

    return {
      userId: kyc.userId,
      fullName: user?.fullName || "Unknown User",
      email: user?.email || "N/A",
      phone: user?.phone || "N/A",
      kyc,
    };
  });
}

async function updateKycStatus(userId, status) {
  const kycRecords = await readJson(kycFile);

  const index = kycRecords.findIndex(
    (item) => item.userId === userId
  );

  if (index === -1) {
    const error = new Error("KYC record not found");
    error.statusCode = 404;
    throw error;
  }

  const record = kycRecords[index];

  record.identityStatus = status;
  record.addressStatus = status;
  record.overallStatus = status;
  record.updatedAt = new Date().toISOString();

  kycRecords[index] = record;

  await writeKyc(kycRecords);

  return record;
}

module.exports = {
  getAllKycReviews,
  updateKycStatus,
};
