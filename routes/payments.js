const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Payment = require("../models/Payments");
const User = require("../models/User");
const PaymentDetail = require("../models/PaymentDetail");

//@route    GET api/payments
//@desc     Get all payments for all users
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      date: -1,
    });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }
});

//@route    POST api/payments/add
//@desc     Add new Payment
//@access   PRIVATE
router.post(
  "/new",
  [
    auth,
    [check("req.body.*.QUBID", "QUBID Number is required").not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array({ onlyFirstError: true })[0].msg });
    }
    const paymentField = req.body[0];
    paymentField.addedByUser = req.user.id;

    const paymentDetailFields = {};
    const paymentCalc = req.body[1];
    const markingCalc = req.body[2];
    const officeHours = req.body[3];
    paymentDetailFields.paymentCalc = paymentCalc;
    paymentDetailFields.markingCalc = markingCalc;
    paymentDetailFields.officeHours = officeHours;
    paymentDetailFields.addedByUser = req.user.id;
    paymentDetailFields.updatedByUser = req.user.id;

    try {
      let newPaymentDetail = new PaymentDetail(paymentDetailFields);
      let newPayment = new Payment(paymentField);
      let updateUser = await User.findById({ _id: paymentField.user });
      updateUser.payments.push(newPayment);
      newPayment.paymentDetail = newPaymentDetail;
      updateUser.save();
      newPaymentDetail.save();
      const payment = newPayment.save();
      res.status(200).json(payment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ error: err.message });
    }
  }
);

//@route    PUT api/payments/reject
//@desc     Update All Pending payments as rejected
//@access   PRIVATE
router.put("/reject", auth, async (req, res) => {
  try {
    let payments = await Payment.find({ paymentStatus: "Pending" });
    console.log(payments);
    if (!payments.length) {
      return res
        .status(404)
        .json({ error: "No pending payments found to reject" });
    } else {
      payments = await Payment.find({ paymentStatus: "Pending" }).updateMany({
        $set: {
          paymentStatus: "Rejected",
          updatedByUser: req.user.id,
          updatedByUserDate: Date.now(),
        },
      });
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/approve
//@desc     Update All Pending payments as approved
//@access   PRIVATE
router.put("/approve", auth, async (req, res) => {
  try {
    let payments = await Payment.find({ paymentStatus: "Pending" });
    console.log(payments);
    if (!payments.length) {
      return res
        .status(404)
        .json({ error: "No pending payments found to Approve" });
    } else {
      payments = await Payment.find({ paymentStatus: "Pending" }).updateMany({
        $set: {
          paymentStatus: "Approved",
          updatedByUser: req.user.id,
          updatedByUserDate: Date.now(),
        },
      });
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/approve
//@desc     Update All Pending payments as approved
//@access   PRIVATE
router.put("/paid", auth, async (req, res) => {
  try {
    let payments = await Payment.find({ paymentStatus: "Approved" });
    console.log(payments);
    if (!payments.length) {
      return res
        .status(404)
        .json({ error: "No approved payments, pending payment" });
    } else {
      payments = await Payment.find({ paymentStatus: "Approved" }).updateMany({
        $set: {
          paymentStatus: "Paid",
          updatedByUser: req.user.id,
          updatedByUserDate: Date.now(),
        },
      });
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/:id
//@desc     Update User Payment
//@access   PRIVATE
router.put("/:id", auth, async (req, res) => {
  console.log("Update User Payment ", req.body);
  // const { name, email, phone, type } = req.body;
  // //build payment object
  // const paymentFields = {};
  // if (name) paymentFields.name = name;
  // if (email) paymentFields.email = email;
  // if (phone) paymentFields.phone = phone;
  // if (type) paymentFields.type = type;

  // try {
  //   let payment = await Payment.findById(req.params.id); // find payment by ID
  //   if (!payment) return res.status(404).json({ msg: "payment not found" });
  //   //ensure user owns payment
  //   if (payment.user.toString() !== req.user.id) {
  //     return res.status(401).json({ msg: "Not Authorised" });
  //   }
  //   payment = await Payment.findByIdAndUpdate(
  //     req.params.id,
  //     { $set: paymentFields },
  //     { new: true }
  //   );

  //   res.json(payment);
  // } catch (err) {
  //   console.error(err.message);
  //   res.status(500).send("Server Error");
  // }
});
//@route    PUT api/payments/:id/approve
//@desc     Update User Payment as Approved
//@access   PRIVATE
router.put("/:id/approve", auth, async (req, res) => {
  try {
    let payments = await Payment.findById(req.params.id);
    console.log(payments);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not current set to pending" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Approved";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      console.log(paymentFields);
      payments = await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/:id/reject
//@desc     Update User Payment as rejected
//@access   PRIVATE
router.put("/:id/reject", auth, async (req, res) => {
  try {
    let payments = await Payment.findById(req.params.id);
    console.log(payments);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not current set to pending" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Rejected";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      console.log(paymentFields);
      payments = await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/:id/reject
//@desc     Update User Payment as rejected
//@access   PRIVATE
router.put("/:id/onhold", auth, async (req, res) => {
  try {
    let payments = await Payment.findById(req.params.id);
    console.log(payments);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not current set to pending" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "On Hold";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      console.log(paymentFields);
      payments = await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/:id/pending
//@desc     Update User Payment as pending
//@access   PRIVATE
router.put("/:id/pending", auth, async (req, res) => {
  try {
    let payments = await Payment.findById(req.params.id);
    console.log(payments);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not currently set to on hold" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Pending";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      console.log(paymentFields);
      payments = await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    PUT api/payments/:id/pending
//@desc     Update User Payment as pending
//@access   PRIVATE
router.put("/:id/paid", auth, async (req, res) => {
  try {
    let payments = await Payment.findById(req.params.id);
    console.log(payments);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not currently set to approved" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Paid";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      console.log(paymentFields);
      payments = await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await Payment.find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

//@route    DELETE api/payments/:id
//@desc     Delete Payment
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id); // find payment by ID
    console.log(payment);
    if (!payment) return res.status(404).json({ error: "payment not found" });
    //ensure user owns payment
    if (payment.user.toString() === req.user.id) {
      return res.status(401).json({ error: "You cannot delete this payment" });
    }
    await PaymentDetail.findByIdAndRemove(payment.paymentDetail);
    await User.updateOne({ _id: payment.user }, { $pull: { payments: payment._id }});
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
