const express = require("express");

const {
  create,
  listMine,
} = require("../controllers/application.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/mine", authMiddleware, listMine);

module.exports = router;
