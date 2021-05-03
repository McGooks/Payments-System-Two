const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Stat = require("../models/Payments");
const User = require("../models/User");

function pad(num, size) {
  return ("0" + num).substr(-size);
}

let month = new Date().getMonth() + 1;
currentPeriod = parseInt(
  new Date().getFullYear().toString() + pad(month.toString(), 2)
);

function getAcademicYear() {
  let year = new Date().getFullYear();
  let lastyear = new Date().getFullYear() - 1;
  let range = [];
  let lastrange = [];
  let academicYear = [];
  lastrange.push(lastyear);
  range.push(year);
  for (var i = 1; i < 2; i++) {
    lastrange.push(lastyear + i);
    range.push(year + i);
    academicYear.push(lastrange[i - 1] + "/" + lastrange[i].toString());
  }
  return academicYear[0];
}
let CurrentAcaYear = getAcademicYear();

function getPrevAcademicYear() {
  let year = new Date().getFullYear() - 1;
  let lastyear = new Date().getFullYear() - 2;
  let range = [];
  let lastrange = [];
  let academicYear = [];
  lastrange.push(lastyear);
  range.push(year);
  for (var i = 1; i < 2; i++) {
    lastrange.push(lastyear + i);
    range.push(year + i);
    academicYear.push(lastrange[i - 1] + "/" + lastrange[i].toString());
  }
  return academicYear[0];
}
let PrevAcaYear = getPrevAcademicYear();

//@route    GET api/stats/
//@desc     Get stats
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const statsActive = await User.countDocuments({ status: "Active" });
    const statsActiveTaxSigned = await User.countDocuments({
      status: "Active",
      "taxDeclaration.0.signed": "true",
    });
    const statsPending = await Stat.countDocuments({
      paymentStatus: "Pending",
    });
    const statsExpired = await Stat.countDocuments({ status: "Expired" });
    const statsPaymentPendingAuth = await Stat.aggregate([
      { $match: { paymentStatus: "Pending" } },
      {
        $group: {
          _id: "$paymentStatus",
          total: { $sum: "$amount" },
        },
      },
    ]);
    const statsPaymentAuthMTD = await Stat.aggregate([
      {
        $project: {
          paymentPeriodNum: 1,
          amount: 1,
          paymentStatus: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              paymentPeriodNum: currentPeriod,
            },
            {
              paymentStatus: { $in: ["Approved", "Paid"] },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);
    const statsPaymentAuthYTD = await Stat.aggregate([
      {
        $project: {
          amount: 1,
          paymentStatus: 1,
          academicYear: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              academicYear: CurrentAcaYear,
            },
            {
              paymentStatus: { $in: ["Approved", "Paid"] },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);
    const statsCurrentSemComp = await Stat.aggregate([
      {
        $project: {
          amount: 1,
          paymentStatus: 1,
          academicYear: 1,
          semester: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              academicYear: CurrentAcaYear,
            },
            {
              paymentStatus: { $in: ["Approved", "Paid"] },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$semester",
          x: { $first: "$semester" },
          y: {
            $sum: "$amount",
          },
        },
      },
      { $unset: ["_id"] },
    ]);
    const statsPrevSemComp = await Stat.aggregate([
      {
        $project: {
          amount: 1,
          paymentStatus: 1,
          academicYear: 1,
          semester: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              academicYear: PrevAcaYear,
            },
            {
              paymentStatus: { $in: ["Approved", "Paid"] },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$semester",
          x: { $first: "$semester" },
          y: {
            $sum: "$amount",
          },
        },
      },
      { $unset: ["_id"] },
    ]);

    stats = [
      { statsActive },
      { statsPending },
      { statsExpired },
      { statsPaymentPendingAuth },
      { statsPaymentAuthMTD },
      { statsPaymentAuthYTD },
      { CurrentAcaYear },
      { statsCurrentSemComp },
      { statsPrevSemComp },
      { statsActiveTaxSigned },
    ];
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
