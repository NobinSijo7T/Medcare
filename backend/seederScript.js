require("dotenv").config();

const productData = require("./data/products");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");

connectDB();

const adminUsers = [
  {
    name: "Admin User",
    email: "admin@pharmacy.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "Super Admin",
    email: "superadmin@pharmacy.com",
    password: "superadmin123",
    isAdmin: true,
  },
];

const regularUsers = [
  {
    name: "Test User",
    email: "user@pharmacy.com",
    password: "user123",
    isAdmin: false,
  },
];

const importData = async () => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    
    await Product.insertMany(productData);
    await User.insertMany([...adminUsers, ...regularUsers]);
    
    console.log("Data Import Success");
    console.log("\n=== Admin Accounts ===");
    adminUsers.forEach(admin => {
      console.log(`Email: ${admin.email} | Password: ${admin.password}`);
    });
    console.log("\n=== User Accounts ===");
    regularUsers.forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password}`);
    });

    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

importData();
