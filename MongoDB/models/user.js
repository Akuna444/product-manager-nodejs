const { getDb } = require("../util/db");
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email, id, cart) {
    console.log(cart);
    this.name = username;
    this.email = email;
    this.id = id;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    return db.collection("user").insertOne(this);
  }

  addToCart(product) {
    const cartItemIndex = this.cart.items.findIndex((cartProduct) => {
      return cartProduct.productId.toString() === product._id.toString();
    });
    console.log(cartItemIndex);
    const updatedCartItems = [...this.cart.items];
    if (cartItemIndex >= 0) {
      const newQuantity = this.cart.items[cartItemIndex].quantity + 1;
      updatedCartItems[cartItemIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    console.log(this.cart.items);
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });

    console.log(productIds);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        console.log("hhhi", products);
        return products.map((product) => {
          console.log("hi", product);
          return {
            ...product,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteCartItems(prodId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== prodId.toString();
    });
    console.log("updated cart items", updatedCartItems);
    const db = getDb();
    return db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrders() {
    const db = getDb();
    return this.getCart().then((products) => {
      const orders = {
        items: products,
        user: {
          _id: new ObjectId(this.id),
          name: this.name,
          email: this.email,
        },
      };
      return db
        .collection("orders")
        .insertOne(orders)
        .then((result) => {
          this.cart = { items: [] };
          return db
            .collection("user")
            .updateOne(
              { _id: new ObjectId(this.id) },
              { $set: { cart: { items: [] } } }
            );
        });
    });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this.id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("user").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
