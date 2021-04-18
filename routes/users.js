const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const config = require("config");
const User = require("../models/User");
const auth = require("../middleware/auth");

//Mail Gun
const mailgun = require("mailgun-js");
const DOMAIN = config.get("mailgun_DOMAIN");
const mg = mailgun({ apiKey: config.get("mailgun_APIKEY"), domain: DOMAIN });

//@route    POST api/users/register
//@desc     Register a user
//@access   Public
router.post(
  "/register",
  [
    check("QUBID", "Please insert your QUB ID")
      .isLength({ min: 8 })
      .not()
      .isEmpty(),
    check("email", "Please insert a valid email").isEmail(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars long")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array({ onlyFirstError: true })[0].msg });
    }
    const { QUBID, email, password } = req.body;
    try {
      let user = await User.findOne({ QUBID }); // find user
      console.log(user);
      if (user) {
        res.status(400).json({
          error: "User already exists, please user system administrator",
        }); // if user already exists throw error
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
          res.json({ token, msg: "Validated" });
        }
      );
      const emailToken = jwt.sign(payload, config.get("JWT_ACC_ACTIVATE"), {
        expiresIn: 360000,
      });

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
                                        <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#d6000d"><a href="${config.get(
                                                              "CLIENT_URL"
                                                            )}/users/confirm-email/${emailToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
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
                                        <p style="margin: 0;">Cheers,<br>DemPay Team @ QUB</p>
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
      // mg.messages().send(data, function (err) {
      //   if (err) {
      //     console.log("The following error occurred: ", err);
      //   } else {
      //     console.log("Email successfully sent to: " + email);
      //   }
      // }); // Send Email
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

//@route    POST api/user/password-reset/:id
//@desc     Get User and issue password reset to email address
//@access   PRIVATE
router.post("/password-reset-request/:id", auth, async (req, res) => {
  try {
    let findUser = await User.findById(req.params.id).select([
      "id",
      "email",
      "firstName",
    ]);
    console.log(findUser);
    const { email, _id } = findUser;
    if (!findUser) {
      res.status(400).json({ error: `User does not exist` }); // if user already exists throw error
    } else {
      const emailToken = jwt.sign({ email, _id }, config.get("JWT_PWDRESET"), {
        expiresIn: 360000,
      });
      const data = {
        from: "DemPay <noreply@dempay.com>",
        to: email,
        subject: "Reset Your Password",
        html: `
        <!DOCTYPE html>
<html>

<head>
    <title>Reset Your Password</title>
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
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> Help has arrived. A password reset request was made for your email address via DemPay </div>
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
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Help has arrived!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
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
                            <p style="margin: 0;">Hi ${
                              findUser.firstName
                            }, it looks like you have requested a password reset for your DemPay account. To help get you back up and running please follow the steps below:</p>
                            <br>
                            <ol>
                              <li style="margin: 0;">
                              Clicking the button below to be taken to our super secret password reset page
                              </li>
                              <li style="margin: 0;">
                              Insert your new password, into both fields & hit submit
                              </li>
                              <li style="margin: 0;">
                              That's you done, you can login with your new password!
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
                                                <td align="center" style="border-radius: 3px;" bgcolor="#d6000d"><a href="${config.get(
                                                  "CLIENT_URL"
                                                )}/users/password-reset/${emailToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Reset Your Password</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If you have any questions, just reply to this email — we're always happy to help out.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers,<br>DemPay Team @ QUB</p>
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
      mg.messages().send(data); // Send Email
      res.status(200).json(findUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

let round = function (num, precision) {
  num = parseFloat(num);
  if (!precision) return num.toLocaleString();
  return (Math.round(num / precision) * precision).toLocaleString();
};

router.put(
  "/password-reset/:token",
  [
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars long")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array({ onlyFirstError: true })[0].msg });
    }
    const token = req.params.token;
    const { password } = req.body;
    console.log(req.body);
    console.log(password);
    try {
      if (token) {
        const decode = jwt.verify(
          token,
          config.get("JWT_PWDRESET"),
          function (err, decodedToken) {
            if (err) {
              return res.status(400).json({ error: err.message });
            }
            return decodedToken;
          }
        );
        console.log(decode);
        const { _id, exp } = decode;
        let date = Date.now();
        let longExp = exp * 1000;
        console.log("current date", date);
        console.log("expiry date", longExp);
        if (longExp < date) {
          return res.status(400).json({ error: "Token has expired" });
        }
        const salt = await bcrypt.genSalt(10); // Password salt
        const userFields = {};
        userFields.password = await bcrypt.hash(password, salt); // Pass in password and hash
        userFields.passwordResetTokenExpiresAt = new Date(exp * 1000);
        userFields.passwordResetToken = token;
        userFields.updatedById = _id;
        userFields.emailVerifiedDate = Date.now();
        userFields.updatedAt = Date.now();
        try {
          let userPasswordReset = await User.findById({ _id }); // find user by ID address
          console.log(userPasswordReset);
          const userPasswordResetId = userPasswordReset.id; // Extract User ID
          if (!userPasswordResetId) {
            return res.status(404).json({ error: "User not found" });
          } else {
            passwordUser = await User.findByIdAndUpdate(
              userPasswordResetId,
              { $set: userFields },
              { new: true }
            ); // find user by ID address
            res.json(passwordUser); // Return Json
          }
        } catch (err) {
          res.status(500).json({ error: "User record cannot be verified" });
        }
      } else {
        return res.json({ error: "An error occurred" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

//@route    GET api/users
//@desc     Get all users
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find()
      .sort({
        date: -1,
      })
      .select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }
});

//@route    POST api/users/confirm-email/:token
//@desc     Activate User Account with token
//@access   Private

router.put("/confirm-email/:token", async (req, res) => {
  const token = req.params.token;
  try {
    if (token) {
      const decode = jwt.verify(
        token,
        config.get("JWT_ACC_ACTIVATE"),
        function (err, decodedToken) {
          if (err) {
            return res.status(400).json({ error: "This token has expired" });
          }
          return decodedToken;
        }
      );
      const { email, iat, exp } = decode;

      const userFields = {};
      userFields.emailTokenIssued = new Date(iat * 1000);
      userFields.emailTokenExpiry = new Date(exp * 1000);
      userFields.emailVerified = true;
      userFields.status = "Active";
      userFields.emailVerifiedDate = Date.now();
      userFields.updatedAt = Date.now();
      try {
        let UpdatedUser = await User.findOne({ email }); // find user by email address
        if (UpdatedUser.emailVerified) {
          return res.status(404).json({
            error:
              "This email address has already been confirmed, please log in",
          });
        }
        const updatedUserId = UpdatedUser.id; // Extract User ID
        if (!UpdatedUser) {
          return res.status(404).json({ error: "User not found" });
        } else {
          NewUpdatedUser = await User.findByIdAndUpdate(
            updatedUserId,
            { $set: userFields },
            { new: true }
          ); // find user by ID address
          res.json(NewUpdatedUser); // Return
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "User record cannot be verified" });
      }
    } else {
      return res.json({ error: "An error occurred here" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
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
      return res
        .status(400)
        .json({ error: errors.array({ onlyFirstError: true })[0].msg });
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
      res.status(500).send({ error: err.message });
    }
  }
);

//@route    PUT api/users/:id
//@desc     Update User User
//@access   PRIVATE
router.put("/:id", auth, async (req, res) => {
  const { QUBID, firstName, lastName, email, role } = req.body;
  //build user object
  const userFields = {};
  if (QUBID) userFields.QUBID = QUBID;
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;
  if (role) userFields.role = role;

  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ error: "user not found" });
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }
});

//@route    DELETE api/users/:id
//@desc     Delete User
//@access   PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id); // find user by ID
    if (!user) return res.status(404).json({ error: "user not found" });
    await User.findByIdAndRemove(
      req.params.id,
      res.json({ error: "User Removed" })
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
