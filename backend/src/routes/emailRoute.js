const express = require("express");
const { alertEmail } = require("../controllers/emailController");

const router = express.Router();

router.post("/alert", alertEmail);

module.exports = router;