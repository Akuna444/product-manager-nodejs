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

  req.user
    .createProduct(
      {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      }
      // {
      //   includes: User,
      // }
    )
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    });
};

exports.editProducts = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  const prodId = req.params.productId;
  req.user
    .getProducts({
      where: {
        id: prodId,
      },
    })
    .then((products) => {
      const product = products[0];
      console.log(product);
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

  Product.findByPk(prodId)
    .then((product) => {
      console.log("prod", product);
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescrption;
      product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
      console.log("Product Changed");
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {
      id: prodId,
    },
  });
  res.redirect("/admin/products");
};
