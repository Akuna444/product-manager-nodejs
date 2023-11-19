const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const Product = require("./models/product");
const User = require("./models/user.js");

const app = express();
const sequelize = require("./util/db");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const pageNotFoundControllers = require("./controllers/404.js");
const Cart = require("./models/cart.js");
const CartItem = require("./models/cartItem.js");
const Order = require("./models/order.js");
const OrderItem = require("./models/orderItem.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  });
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(pageNotFoundControllers.pageNotFound);

Product.belongsTo(User, {
  constraint: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) User.create({ name: "Akuna", email: "akuna@matata.com" });
    return user;
  })
  .then((user) => {
    user.createCart();
  })
  .then((cart) => {
    app.listen(3000, () => {
      console.log("Started on 3000");
    });
  })
  .catch((err) => console.log(err.message));
