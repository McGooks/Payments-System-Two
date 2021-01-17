const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Payment = require("../models/Payments");

//@route    GET api/payments
//@desc     Get all users payments
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      date: -1,
    });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/payments
//@desc     Add new Payment
//@access   PRIVATE
router.post(
  "/",
  [auth, [check("nsp_number", "NSP Number is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      nsp_number,
      account,
      project,
      subanalysis,
      amount,
      student_cohort,
      cohort_id,
      type,
    } = req.body;
    try {
      const newPayment = new Payment({
        // nsp_ID: req.NSUser.id,
        nsp_number,
        account,
        project,
        subanalysis,
        amount,
        student_cohort,
        cohort_id,
        type,
        addedByUser: req.user.id,
      });
      const payment = await newPayment.save();
      res.json(payment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/payments/:id
//@desc     Update User Payment
//@access   PRIVATE
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;
  //build payment object
  const paymentFields = {};
  if (name) paymentFields.name = name;
  if (email) paymentFields.email = email;
  if (phone) paymentFields.phone = phone;
  if (type) paymentFields.type = type;

  try {
    let payment = await Payment.findById(req.params.id); // find payment by ID
    if (!payment) return res.status(404).json({ msg: "payment not found" });
    //ensure user owns payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorised" });
    }
    payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: paymentFields },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/payments/:id
//@desc     Delete Payment
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id); // find payment by ID
    if (!payment) return res.status(404).json({ msg: "payment not found" });
    //ensure user owns payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorised" });
    }
    await Payment.findByIdAndRemove(
      req.params.id,
      res.json({ msg: "Payment Removed" })
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
