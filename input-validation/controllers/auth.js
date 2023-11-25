const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length === 0) {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length === 0) {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      console.log(hashedPassword);
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
      return transport
        .sendMail({
          to: email,
          from: "aklilsolomon3@gmail.com",
          subject: "Signed in succesfully",
          html: "<h1>Signed in successfully! boi</h1>",
        })
        .catch((err) => console.log(err));
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length === 0) {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset",
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with this email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transport
          .sendMail({
            to: req.body.email,
            from: "aklilsolomon3@gmail.com",
            subject: "Reset your password",
            html: `<h1>You requested password reset</h1>
            <p>Click the <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>`,
          })
          .catch((err) => console.log(err));
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  console.log(token);
  User.findOne({
    resetToken: token,
    // resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    console.log(user);
    let message = req.flash("error");
    if (message.length === 0) {
      message = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: message,
      token: token,
      userId: user._id.toString(),
    });
  });
};

exports.postNewPassword = (req, res, next) => {
  const { userId, password, token } = req.body;
  let resetUser;

  User.findOne({
    resetToken: token,
    _id: userId,
  })
    .then((user) => {
      resetUser = user;

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetTokenExpiration = undefined;
      resetUser.resetToken = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
