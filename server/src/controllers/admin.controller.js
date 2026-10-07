const {
  getAllApplications,
  updateApplicationStatus,
} = require("../services/application/application.service");

const allowedStatuses = [
  "pending",
  "under-review",
  "approved",
  "rejected",
];

async function listApplications(req, res) {
  try {
    const applications = await getAllApplications();

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

async function updateStatus(req, res) {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application = await updateApplicationStatus(
      req.params.id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to update application",
    });
  }
}

module.exports = {
  listApplications,
  updateStatus,
};
