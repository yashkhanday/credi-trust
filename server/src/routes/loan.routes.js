const express = require("express");

const {
  listLoans,
  getLoan,
} = require("../controllers/loan.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, listLoans);
router.get("/:id", authMiddleware, getLoan);

module.exports = router;
