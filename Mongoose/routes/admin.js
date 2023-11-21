const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.addProducts);

// // /admin/add-product => POST
router.post("/add-product", adminController.postProducts);

router.get("/products", adminController.getProducts);
router.get("/edit-products/:productId", adminController.editProducts);
router.post("/edit-products", adminController.postEditProducts);
router.post("/delete-product", adminController.postDeleteProduct);

exports.routes = router;
