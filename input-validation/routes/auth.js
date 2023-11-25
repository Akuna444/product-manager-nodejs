const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid message!")
      .custom((value, req) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body(
      "password",
      "Please enter a valid password with atlease length of 5 and text and numbers only"
    )
      .isLength({ min: 5, max: 10 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords should match");
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);
router.get("/method");

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
