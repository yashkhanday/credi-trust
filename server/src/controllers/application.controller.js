const {
  applicationSchema,
} = require("../validators/application.validator");

const {
  createApplication,
  getApplicationsByUser,
} = require("../services/application/application.service");

async function create(req, res) {
  try {
    const validatedData = applicationSchema.parse(req.body);

    const application = await createApplication({
      ...validatedData,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Loan application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Unable to submit loan application",
    });
  }
}

async function listMine(req, res) {
  try {
    const applications = await getApplicationsByUser(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch applications",
    });
  }
}

module.exports = {
  create,
  listMine,
};
