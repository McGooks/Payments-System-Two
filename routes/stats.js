const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Stat = require("../models/User");

//@route    GET api/stats/active
//@desc     Get all active user stats
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const statsActive = await Stat.countDocuments({ status: "Active" });
    const statsPending = await Stat.countDocuments({ status: "Pending" });
    const statsExpired = await Stat.countDocuments({ status: "Expired" });
    const statsPaymentAuthMTD = await Stat.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: "$payment" },
        },
      },
    ]);
    stats = [
      { id: 1, statsActive },
      { id: 2, statsPending },
      { id: 3, statsExpired },
      { id: 4, statsPaymentAuthMTD },
    ];
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
