const express = require("express");
const router = express.Router();
const{
  getProducts,
  getProductById,
  filterProducts,
  sortProducts,
} = require("../controller/productControllers");


router.get("/", getProducts);
router.get("/:id", getProductById);

router.route("/filter/:category").get(filterProducts);
router.route("/sort/:sortOrder").get(sortProducts);


module.exports = router;
