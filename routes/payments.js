import { Router } from "express";
const router = Router();
import auth from "../middleware/auth";
import { check, validationResult } from "express-validator";
import Payment, {
  find,
  findById,
  findByIdAndUpdate,
  findByIdAndRemove,
} from "../models/Payments";
import User from "../models/User";
import PaymentDetail, {
  findByIdAndRemove as _findByIdAndRemove,
} from "../models/PaymentDetail";

//@route    GET api/payments
//@desc     Get all payments for all users
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const payments = await find().sort({
      date: -1,
    });
    res.json(payments);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//@route    POST api/payments/new
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
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

//@route    PUT api/payments/reject
//@desc     Update All Pending payments as rejected
//@access   PRIVATE
router.put("/reject", auth, async (req, res) => {
  try {
    let payments = await find({ paymentStatus: "Pending" });
    if (!payments.length) {
      return res
        .status(404)
        .json({ error: "No pending payments found to reject" });
    } else {
      payments = await find({ paymentStatus: "Pending" }).updateMany({
        $set: {
          paymentStatus: "Rejected",
          updatedByUser: req.user.id,
          updatedByUserDate: Date.now(),
        },
      });
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/approve
//@desc     Update All Pending payments as approved
//@access   PRIVATE
router.put("/approve", auth, async (req, res) => {
  try {
    let payments = await find({ paymentStatus: "Pending" });
    if (!payments.length) {
      return res
        .status(404)
        .json({ error: "No pending payments found to Approve" });
    } else {
      payments = await find({ paymentStatus: "Pending" }).updateMany({
        $set: {
          paymentStatus: "Approved",
          updatedByUser: req.user.id,
          updatedByUserDate: Date.now(),
        },
      });
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/approve
//@desc     Update All Pending payments as paid
//@access   PRIVATE
router.put("/paid", auth, async (req, res) => {
  try {
    let payments = await find({ paymentStatus: "Approved" });
    if (!payments.length) {
      return res
        .status(404)
        .json({ error: "No approved payments, pending payment" });
    } else {
      payments = await find({ paymentStatus: "Approved" }).updateMany({
        $set: {
          paymentStatus: "Paid",
          updatedByUser: req.user.id,
          updatedByUserDate: Date.now(),
        },
      });
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/:id/approve
//@desc     Update User Payment as Approved
//@access   PRIVATE
router.put("/:id/approve", auth, async (req, res) => {
  try {
    let payments = await findById(req.params.id);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not current set to pending" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Approved";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      payments = await findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/:id/reject
//@desc     Update User Payment as rejected
//@access   PRIVATE
router.put("/:id/reject", auth, async (req, res) => {
  try {
    let payments = await findById(req.params.id);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not current set to pending" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Rejected";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      payments = await findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/:id/onhold
//@desc     Update User Payment as onhold
//@access   PRIVATE
router.put("/:id/onhold", auth, async (req, res) => {
  try {
    let payments = await findById(req.params.id);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not current set to pending" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "On Hold";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      payments = await findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/:id/pending
//@desc     Update User Payment as pending
//@access   PRIVATE
router.put("/:id/pending", auth, async (req, res) => {
  try {
    let payments = await findById(req.params.id);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not currently set to on hold" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Pending";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      payments = await findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    PUT api/payments/:id/pending
//@desc     Update User Payment as paid
//@access   PRIVATE
router.put("/:id/paid", auth, async (req, res) => {
  try {
    let payments = await findById(req.params.id);
    if (!payments) {
      return res
        .status(404)
        .json({ error: "This payment is not currently set to approved" });
    } else {
      const paymentFields = {};
      paymentFields.paymentStatus = "Paid";
      paymentFields.updatedById = req.user.id;
      paymentFields.updatedAt = Date.now();
      payments = await findByIdAndUpdate(
        req.params.id,
        { $set: paymentFields },
        { new: true }
      );
      payments = await find({});
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//@route    GET api/payments/:id
//@desc     Get selected payment
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const payments = await findById(req.params.id).populate("paymentDetail");
    res.json(payments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route    DELETE api/payments/:id
//@desc     Delete User Payment
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let payment = await findById(req.params.id); // find payment by ID
    if (!payment) return res.status(404).json({ error: "payment not found" });
    //ensure user owns payment
    if (payment.user.toString() === req.user.id) {
      return res.status(401).json({ error: "You cannot delete this payment" });
    }
    await _findByIdAndRemove(payment.paymentDetail);
    await User.updateOne(
      { _id: payment.user },
      { $pull: { payments: payment._id } }
    );
    await findByIdAndRemove(
      req.params.id,
      res.json({ error: "Payment Removed" })
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
