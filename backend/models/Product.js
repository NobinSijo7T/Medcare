const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  unique_id: {
    type: String,
    required: true,
    unique: true,
  },
  imgsrc: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // Optional fields for detailed view
  indication: {
    type: String,
  },
  dosage: {
    type: String,
  },
  sideEffects: {
    type: String,
  },
  countInStock: {
    type: Number,
    default: 0,
  }
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
