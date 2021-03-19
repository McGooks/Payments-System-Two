const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Stat = require("../models/User");

//@route    GET api/stats/
//@desc     Get stats
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const statsActive = await Stat.countDocuments({ status: "Active" });
    const statsPending = await Stat.countDocuments({ status: "Pending" });
    const statsExpired = await Stat.countDocuments({ status: "Expired" });
    const statsPaymentPendingAuth = await Stat.aggregate([
      {$match: { status: 'Pending' }},
      {
        $group: {
          _id: "$status",
          total: { $sum: "$payment" },
        },
      },
    ]);
    const statsPaymentAuthMTD = await Stat.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: "$payment" },
        },
      },
    ]);
    const statsPaymentAuthYTD = await Stat.aggregate([
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
      { id: 4, statsPaymentPendingAuth },
      { id: 5, statsPaymentAuthMTD },
      { id: 6, statsPaymentAuthYTD },
    ];
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
