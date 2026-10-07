const fs = require("fs/promises");
const path = require("path");

const kycFile = path.join(__dirname, "../../../data/kyc.json");

async function getAllKyc() {
  const data = await fs.readFile(kycFile, "utf8");
  return JSON.parse(data);
}

async function saveAllKyc(records) {
  await fs.writeFile(
    kycFile,
    JSON.stringify(records, null, 2),
    "utf8"
  );
}

async function getKycByUserId(userId) {
  const records = await getAllKyc();

  return (
    records.find((record) => record.userId === userId) || {
      userId,

      fullName: "",
      dateOfBirth: "",
      gender: "",

      address: "",
      city: "",
      state: "",
      pincode: "",

      employmentType: "",
      monthlyIncome: "",
      companyName: "",
      workExperience: "",

      identityType: "",

      identityStatus: "not-submitted",
      addressStatus: "not-submitted",
      consentStatus: "pending",
      overallStatus: "not-submitted",

      updatedAt: null,
    }
  );
}

async function updateKycByUserId(userId, data) {
  const records = await getAllKyc();

  const existingIndex = records.findIndex(
    (record) => record.userId === userId
  );

  const updated = {
    userId,

    fullName: data.fullName.trim(),
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,

    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode,

    employmentType: data.employmentType,
    monthlyIncome: Number(data.monthlyIncome),
    companyName: data.companyName.trim(),
    workExperience: Number(data.workExperience),

    identityType: data.identityType,

    // Development workflow:
    // actual identity verification will happen through an authorized provider.
    identityStatus: "pending",
    addressStatus: "pending",
    consentStatus: "recorded",
    overallStatus: "pending",

    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    records[existingIndex] = updated;
  } else {
    records.push(updated);
  }

  await saveAllKyc(records);

  return updated;
}

module.exports = {
  getKycByUserId,
  updateKycByUserId,
};
