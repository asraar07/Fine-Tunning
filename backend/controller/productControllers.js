const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const filterProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sort products by price
const sortProducts = async (req, res) => {
  try {
    const sortOrder = req.params.sortOrder === "asc" ? 1 : -1;
    const products = await Product.find({}).sort({ price: sortOrder });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  getProducts,
  getProductById,
  filterProducts,
  sortProducts,
};
