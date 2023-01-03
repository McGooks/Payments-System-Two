import { Router } from "express";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { get } from "config";
const router = Router();
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import User from "../models/User";

//@route    GET api/auth
//@desc     Get logged in user
//@access   Private
router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  next();
});

//@route    POST api/auth
//@desc     Auth user & get token
//@access   Public
router.post(
  "/",
  [
    check("email", "Please insert an email address").not().isEmpty(),
    check("email", "A valid email address is required").isEmail(),
    check("password", "A valid password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ error: errors.array({ onlyFirstError: true })[0].msg });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); // find user email and return user.id
      if (!user) {
        // if user does not exist in DB throw error
        res.status(400).json({
          error: "User account not found, please register an account",
        });
      }
      const isMatch = await compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        // if user password does not match exist throw error
        res
          .status(400)
          .json({ error: "The password you have entered is invalid" });
      }
      if (user.status === "Disabled") {
        // if user account is disabled throw error
        res.status(403).json({
          error:
            "This account has been disabled, please contact the system administrator for support",
        });
      }

      // set payload variable for jwt sign (token)
      const payload = {
        user: {
          id: user.id,
        },
      };
      // on sign pass in payload and also token to expire in secs
      sign(
        payload,
        get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
