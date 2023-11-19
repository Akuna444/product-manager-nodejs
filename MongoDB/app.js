const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

// const Product = require("./models/product");
const User = require("./models/user.js");

const app = express();
const { monogoConnect } = require("./util/db");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const pageNotFoundControllers = require("./controllers/404.js");
// const Cart = require("./models/cart.js");
// const CartItem = require("./models/cartItem.js");
// const Order = require("./models/order.js");
// const OrderItem = require("./models/orderItem.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById("654fc010a7f801da46f5981e").then((user) => {
    console.log("useee,", user);
    req.user = new User(user.name, user.email, user._id, user.cart);

    next();
  });
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(pageNotFoundControllers.pageNotFound);

monogoConnect((result) => {
  // new User("Akuna", "aklilsolomon@gmail.com").save();
  app.listen(3000);
  console.log("App started succesfully!");
});
