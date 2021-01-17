const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

//@route    POST api/users
//@desc     Register a user
//@access   Public
router.post(
  "/",
  [
    check("QUBID", "Please insert your QUB ID").not().isEmpty(),
    check("email", "Please insert a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { QUBID, email, password } = req.body;
    try {
      let user = await User.findOne({ QUBID }); // find user
      if (user) {
        res.status(400).json({ msg: "User already exists, please user system administrator" }); // if user already exists throw error
      }
      // Create new User object with name, email and password
      user = new User({
        QUBID,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10); // Password salt
      user.password = await bcrypt.hash(password, salt); // Pass in password and hash
      await user.save();

      // set payload variable for jwt sign (token)
      const payload = {
        user: {
          id: user.id,
        },
      };
      // on sign pass in payload and also token to expire in secs
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.state(500).send("Server Error");
    }
  }
);

//@route    GET api/Users
//@desc     Get all users
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().sort({
      date: -1,
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/users
//@desc     Add new User
//@access   PRIVATE
router.post(
  "/",
  [auth, [check("QUBID", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { QUBID, firstName, lastName, email, role } = req.body;
    try {
      const newUser = new User({
        QUBID,
        firstName,
        lastName,
        email,
        role,
        updatedById: req.user.id,
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

//@route    PUT api/users/:id
//@desc     Update User User
//@access   PRIVATE
router.put("/:id", auth, async (req, res) => {
  const { QUBID, firstName, lastName, email, role} = req.body;
  //build user object
  const userFields = {};
  if (QUBID) userFields.QUBID = QUBID;
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;
  if (role) userFields.phone = role;

  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ msg: "user not found" });
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

//@route    DELETE api/users/:id
//@desc     Delete User
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ msg: "user not found" });
    await User.findByIdAndRemove(
      req.params.id,
      res.json({ msg: "User Removed" })
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
