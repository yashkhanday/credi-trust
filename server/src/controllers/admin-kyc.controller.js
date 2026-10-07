const {
  getAllKycReviews,
  updateKycStatus,
} = require("../services/kyc/admin-kyc.service");

const allowedStatuses = [
  "pending",
  "verified",
  "rejected",
];

async function listKyc(req, res) {
  try {
    const records = await getAllKycReviews();

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch KYC records",
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid KYC status",
      });
    }

    const kyc = await updateKycStatus(
      req.params.userId,
      status
    );

    return res.status(200).json({
      success: true,
      message: `KYC status updated to ${status}`,
      kyc,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to update KYC status",
    });
  }
}

module.exports = {
  listKyc,
  updateStatus,
};
