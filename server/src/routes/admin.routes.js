const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  listApplications,
  updateStatus: updateApplicationStatus,
} = require("../controllers/admin.controller");

const {
  listKyc,
  updateStatus: updateKycStatus,
} = require("../controllers/admin-kyc.controller");

const {
  create: createUser,
} = require("../controllers/admin-user.controller");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Applications
router.get("/applications", listApplications);
router.patch("/applications/:id/status", updateApplicationStatus);

// KYC
router.get("/kyc", listKyc);
router.patch("/kyc/:userId/status", updateKycStatus);

// Users
router.post("/users", createUser);

module.exports = router;
