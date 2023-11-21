const Product = require("../models/product");

exports.addProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
  });
};

exports.postProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // req.user
  //   .createProduct(
  //     {
  //       title: title,
  //       imageUrl: imageUrl,
  //       price: price,
  //       description: description,
  //     }
  //     // {
  //     //   includes: User,
  //     // }
  //   )
  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user,
  });
  product.save().then((result) => {
    console.log(result);
    res.redirect("/admin/products");
  });
};

exports.editProducts = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) return res.redirect("/");

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: true,
      product,
    });
  });
};

exports.postEditProducts = (req, res, next) => {
  console.log(req.body);
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescrption = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.imageUrl = updatedImageUrl),
        (product.description = updatedDescrption);

      product.save();
    })

    .then((product) => {})
    .then((result) => {
      res.redirect("/admin/products");
      console.log("Product Changed");
    });
};

exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
  res.redirect("/admin/products");
};
