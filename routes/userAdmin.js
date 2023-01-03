import { Router } from "express";
const router = Router();
import { sign } from "jsonwebtoken";
import { genSalt, hash } from "bcryptjs";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import User from "../models/User";
import Payment from "../models/Payments";
import { get } from "config";
//Mail Gun
// const mailgun = require("mailgun-js");
const DOMAIN = get("mailgun_DOMAIN");
// const mg = mailgun({ apiKey: config.get("mailgun_APIKEY"), domain: DOMAIN });

//@route    GET api/userAdmin
//@desc     Get all users
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find()
      .sort({
        date: -1,
      })
      .select(["-password"]);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
    res.status(500).json({ msg: "Unable to get users" });
  }
});

//@route    GET api/userAdmin/active
//@desc     Get all ACTIVE users
//@access   Private
router.get("/active", auth, async (req, res) => {
  try {
    const activeUser = await User.find({
      status: "Active",
      "taxDeclaration.0.signed": "true",
    })
      .sort({
        firstName: 1,
        lastName: 1,
      })
      .select(["firstName", "lastName", "QUBID"]);
    console.log(activeUser);
    res.json(activeUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
    res.status(500).json({ msg: "Unable to get users" });
  }
});

//@route    GET api/userAdmin/:qubID
//@desc     Get users when using NSP Data import
//@access   Private
router.get("/:qubid", auth, async (req, res) => {
  try {
    const NSPUser = await User.findOne({ QUBID: req.params.qubid })
      .sort({
        QUBID: 1,
      })
      .select(["firstName", "lastName", "QUBID", "id"]);
    res.json(NSPUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
    res.status(500).json({ error: "Unable to get users" });
  }
});

//@route    POST api/userAdmin
//@desc     Add new User
//@access   PRIVATE
router.post(
  "/",
  [
    auth,
    [
      check("firstName", "First Name is required").not().isEmpty(),
      check("lastName", "Last Name is required").not().isEmpty(),
      check("email", "Email is required").not().isEmpty(),
      check("QUBID", "QUBID is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array({ onlyFirstError: true })[0].msg });
    }
    const {
      address,
      contact,
      bank,
      dob,
      taxDeclaration,
      email,
      firstName,
      lastName,
      password,
      QUBID,
      NSPID,
      role,
      status,
      qubSchool,
    } = req.body;
    try {
      let newUser = await User.findOne({ email });
      if (newUser) {
        let jsonResponse = "User " + newUser.email + " already exists";
        res.status(400).json({ error: jsonResponse }); // if user already exists throw error
      } else {
        const emailToken = sign(
          { QUBID, email, password },
          get("JWT_ACC_ACTIVATE"),
          { expiresIn: 360000 }
        );

        const data = {
          from: "DemPay <noreply@dempay.com>",
          to: email,
          subject: "Verify Your Email",
          html: `
        <!DOCTYPE html>
<html>

<head>
    <title>Activate Your Account</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#d6000d" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#d6000d" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome to DemPay!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Hi ${firstName}, we're excited to have you join us this year. To get going, we have a few things we need you to do first:</p>
                            <br>
                            <ol>
                              <li style="margin: 0;">
                              Please confirm your email address, by clicking the button below
                              </li>
                              <li style="margin: 0;">
                              Login using your temporary password: <strong>${password}</strong>
                              </li>
                              <li style="margin: 0;">
                              Complete your user profile!
                              </li>
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#d6000d"><a href="${get(
                                                  "CLIENT_URL"
                                                )}/users/confirm-email/${emailToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Your Email Address</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers,<br>DemPay Team </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#d6000d" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #ffffff;">We&rsquo;re here to help you out</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
        `,
        };
        // mg.messages().send(data); // Send Email
        newUser = new User({
          address,
          contact,
          bank,
          taxDeclaration,
          dob,
          email,
          firstName,
          lastName,
          password,
          QUBID,
          NSPID,
          role,
          status,
          qubSchool,
          createdById: req.user.id,
        });
        const salt = await genSalt(10); // Password salt
        newUser.password = await hash(password, salt); // Pass in password and hash
        const user = await newUser.save();
        res.json(user);
        await newUser.save();
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Unable to add new user" });
    }
  }
);

//@route    PUT api/userAdmin/:id
//@desc     Update User
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
    qubSchool,
    NSPID,
  } = req.body;
  //build user object
  const userFields = {};
  if (dob) userFields.dob = dob;
  if (email) userFields.email = email;
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (QUBID) userFields.QUBID = QUBID;
  if (NSPID) userFields.NSPID = NSPID;
  if (role) userFields.role = role;
  if (status === "Active") {
    userFields.status = status;
    userFields.emailVerified = true;
    userFields.emailVerifiedDate = Date.now();
  } else {
    userFields.status = status;
  }
  if (qubSchool) userFields.qubSchool = qubSchool;
  userFields.updatedById = req.user.id;
  userFields.updatedAt = Date.now();

  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ error: "User not found" });
    // ensure user is not current user
    // if (user._id.toString() === req.user.id) {
    //   return res
    //     .status(401)
    //     .json({ error: "Users cannot edit their own records" });
    // }
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//@route    PUT api/userAdmin/NSP/:id
//@desc     Update User NSP ID
//@access   PRIVATE
router.put("/NSP/:id", auth, async (req, res) => {
  const { NSPID } = req.body;
  //build user object
  const userFields = {};
  userFields.NSPID = NSPID;
  userFields.updatedById = req.user.id;
  userFields.updatedAt = Date.now();
  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ error: "User not found" });
    // ensure user is not current user
    if (user._id.toString() === req.user.id) {
      return res
        .status(401)
        .json({ error: "Users cannot edit their own records" });
    }
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//@route    DELETE api/userAdmin/:id
//@desc     Delete User
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ error: "user not found" });
    if (req.params.id === req.user.id) {
      return res
        .status(401)
        .json({ error: "You cannot delete your own record" });
    }
    // await User.findByIdAndRemove(req.params.id,)
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ msg: "User Removed" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
