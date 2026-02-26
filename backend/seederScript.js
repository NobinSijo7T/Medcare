require("dotenv").config();

const productData = require("./data/products");
const sampleOrders = require("./data/orders");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

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
    name: "Arjun Sharma",
    email: "arjun@example.com",
    password: "user123",
    isAdmin: false,
  },
  {
    name: "Priya Patel",
    email: "priya@example.com",
    password: "user123",
    isAdmin: false,
  },
  {
    name: "Rahul Mehta",
    email: "rahul@example.com",
    password: "user123",
    isAdmin: false,
  },
  {
    name: "Neha Gupta",
    email: "neha@example.com",
    password: "user123",
    isAdmin: false,
  },
  {
    name: "Vikram Singh",
    email: "vikram@example.com",
    password: "user123",
    isAdmin: false,
  },
];

const importData = async () => {
  try {
    // ── 1. Clear existing data ────────────────────────────────────────
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("✓ Cleared existing data");

    // ── 2. Insert products ────────────────────────────────────────────
    const insertedProducts = await Product.insertMany(productData);
    console.log(`✓ Inserted ${insertedProducts.length} products`);

    // ── 3. Create users one-by-one (triggers bcrypt hashing) ─────────
    const allUserData = [...adminUsers, ...regularUsers];
    const insertedUsers = [];
    for (const userData of allUserData) {
      const user = new User(userData);
      await user.save();
      insertedUsers.push(user);
    }
    console.log(`✓ Inserted ${insertedUsers.length} users`);

    // ── 4. Seed sample orders ─────────────────────────────────────────
    const ordersToInsert = sampleOrders(insertedUsers, insertedProducts);
    const insertedOrders = await Order.insertMany(ordersToInsert);
    console.log(`✓ Inserted ${insertedOrders.length} sample orders`);

    // ── 5. Summary ────────────────────────────────────────────────────
    console.log("\n================================================");
    console.log("           DATA IMPORT SUCCESSFUL! ✅");
    console.log("================================================");

    console.log("\n🔑  Admin Accounts (isAdmin = true):");
    console.log("┌─────────────────────────────┬──────────────────┐");
    adminUsers.forEach((a) =>
      console.log(`│ ${a.email.padEnd(27)} │ ${a.password.padEnd(16)} │`)
    );
    console.log("└─────────────────────────────┴──────────────────┘");

    console.log("\n👤  Regular User Accounts:");
    console.log("┌─────────────────────────────┬──────────────────┐");
    regularUsers.forEach((u) =>
      console.log(`│ ${u.email.padEnd(27)} │ ${u.password.padEnd(16)} │`)
    );
    console.log("└─────────────────────────────┴──────────────────┘");

    console.log(
      `\n📦  ${insertedOrders.length} sample orders spread across the last 30 days.`
    );
    console.log(
      "   Log in as an admin account to view them in the Admin Panel → Orders tab.\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌  Error during data import:", error);
    process.exit(1);
  }
};

importData();
