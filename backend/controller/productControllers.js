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

const createProduct = async (req, res) => {
  try {
    const { unique_id, imgsrc, title, price, category, indication, dosage, sideEffects, countInStock } = req.body;

    // Check if unique_id already exists
    const existingProduct = await Product.findOne({ unique_id });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this ID already exists" });
    }

    const product = new Product({
      unique_id,
      imgsrc,
      title,
      price,
      category,
      indication,
      dosage,
      sideEffects,
      countInStock: countInStock || 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { unique_id, imgsrc, title, price, category, indication, dosage, sideEffects, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.unique_id = unique_id || product.unique_id;
      product.imgsrc = imgsrc || product.imgsrc;
      product.title = title || product.title;
      product.price = price || product.price;
      product.category = category || product.category;
      product.indication = indication || product.indication;
      product.dosage = dosage || product.dosage;
      product.sideEffects = sideEffects || product.sideEffects;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
