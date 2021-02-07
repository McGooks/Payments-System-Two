const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

//@route    GET api/userAdmin
//@desc     Get all users
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find().sort({
      date: -1,
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/userAdmin
//@desc     Add new User
//@access   PRIVATE
router.post(
  "/",
  [auth, [check("firstName", "First Name is required").not().isEmpty()]],
  [auth, [check("lastName", "Last Name is required").not().isEmpty()]],
  [auth, [check("email", "Email is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      dob,
      email,
      firstName,
      lastName,
      password,
      QUBID,
      role,
      status,
    } = req.body;
    try {
      const newUser = new User({
        dob,
        email,
        firstName,
        lastName,
        password,
        QUBID,
        role,
        status,
        createdById: req.user.id,
      });
      const user = await newUser.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/userAdmin/:id
//@desc     Update User User
//@access   PRIVATE
router.put("/:id", auth, async (req, res) => {
  const {
    dob,
    email,
    firstName,
    lastName,
    QUBID,
    role,
    status,
  } = req.body;
  //build user object
  const userFields = {};
  if (dob) userFields.dob = dob;
  if (email) userFields.email = email;
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (QUBID) userFields.QUBID = QUBID;
  if (role) userFields.role = role;
  if (status) userFields.status = status
  userFields.updatedById = req.user.id
  userFields.updatedAt = Date.now()

  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ msg: "user not found" });
    console.log(req.user.id, "User ID Text")
    console.log(user._id.toString(), "User to String Text")
    // ensure user is not current user
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ msg: "Users cannot edit their own records" });
    }
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/userAdmin/:id
//@desc     Delete User
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log(req.user.id, "my user ID");
    console.log(req.params.id, "id being passed from the table");
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ msg: "user not found" });
    if (req.params.id === req.user.id) {
      return res.status(401).json({ msg: "You cannot delete your own record" });
    }
    await User.findByIdAndRemove(
      req.params.id,
      res.status(200).json({ msg: "User Removed" }),
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
