const { kycSchema } = require("../validators/kyc.validator");

const {
  getKycByUserId,
  updateKycByUserId,
} = require("../services/kyc/kyc.service");

async function getMine(req, res) {
  try {
    const kyc = await getKycByUserId(req.user.userId);

    return res.status(200).json({
      success: true,
      kyc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch KYC profile",
    });
  }
}

async function updateMine(req, res) {
  try {
    const validatedData = kycSchema.parse(req.body);

    const kyc = await updateKycByUserId(
      req.user.userId,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "KYC profile saved successfully",
      kyc,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save KYC profile",
    });
  }
}

module.exports = {
  getMine,
  updateMine,
};
