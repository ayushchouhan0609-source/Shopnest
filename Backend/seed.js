require("dotenv").config();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/userModel");
const Product = require("./models/Product");
const Order = require("./models/Order");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    verified: true,
  },
  {
    name: "Alice",
    email: "alice@example.com",
    password: "password123",
    role: "user",
    verified: true,
  },
  {
    name: "Bob",
    email: "bob@example.com",
    password: "password123",
    role: "user",
    verified: false,
  },
];

const products = [
  {
    name: "T-shirt",
    description: "Comfortable cotton t-shirt",
    price: 299,
    category: "Clothing",
    stock: 50,
    imageUrl: "https://example.com/tshirt.jpg",
  },
  {
    name: "Sneakers",
    description: "Running sneakers",
    price: 2999,
    category: "Footwear",
    stock: 20,
    imageUrl: "https://example.com/sneakers.jpg",
  },
  {
    name: "Coffee Mug",
    description: "Ceramic mug",
    price: 199,
    category: "Home",
    stock: 100,
    imageUrl: "https://example.com/mug.jpg",
  },
];

const importData = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("🗑️  Cleared existing data");

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users and products
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create an example order for the first regular user
    const customer = createdUsers.find((u) => u.role === "user");
    const order = new Order({
      user: customer._id,
      products: [
        {
          product: createdProducts[0]._id,
          quantity: 2,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[2]._id,
          quantity: 1,
          price: createdProducts[2].price,
        },
      ],
      totalAmount: createdProducts[0].price * 2 + createdProducts[2].price,
      address: {
        fullName: customer.name,
        street: "123 Sample St",
        city: "Sample City",
        postalCode: "123456",
        country: "Sample Country",
      },
      paymentId: "seed_payment_id_1",
      status: "Processing",
    });

    await order.save();
    console.log("✅ Created 1 order");

    console.log("\n✅ Data Imported Successfully!\n");
    console.log("📝 Login Credentials:\n");
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role}\n`);
    });
    console.log("📦 Products Created: " + createdProducts.length);
    console.log("📋 Orders Created: 1\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error with data import:", error.message);
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  importData();
}
