const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
  getMine,
  updateMine,
} = require("../controllers/kyc.controller");

const router = express.Router();

router.get("/me", authMiddleware, getMine);

router.patch("/me", authMiddleware, updateMine);

module.exports = router;
