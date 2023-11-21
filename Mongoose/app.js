const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const Product = require("./models/product");
const User = require("./models/user.js");

const app = express();

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
  User.findById("655a0ad1e7861b437dc12413").then((user) => {
    req.user = user;

    next();
  });
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(pageNotFoundControllers.pageNotFound);

mongoose
  .connect(
    "mongodb+srv://akuna444:lYlyqPjkwCsbU51A@cluster0.ex41jje.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    // const user = new User({
    //   name: "Akuna",
    //   email: "akunasolo@gmail.com",
    //   items: [],
    // });
    // user.save();
    app.listen(3000);
    console.log("App started succesfully");
  });
