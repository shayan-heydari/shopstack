// Seed script: clears the products collection and fills it with
// sample products from 3 fake vendors. Run with: npm run seed
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const vendors = [
  { vendorId: "vendor-1", vendorName: "Northwind Supply" },
  { vendorId: "vendor-2", vendorName: "Maple Street Goods" },
  { vendorId: "vendor-3", vendorName: "True North Outfitters" },
];

// product ideas per category: [base name, rough price]
const catalog = {
  Shoes: [
    ["Trail Running Shoes", 89.99],
    ["Canvas Sneakers", 54.5],
    ["Leather Boots", 139.0],
    ["Running Shoes", 119.99],
    ["Slip-On Loafers", 74.25],
  ],
  Clothing: [
    ["Cotton Hoodie", 49.99],
    ["Denim Jacket", 89.5],
    ["Plain T-Shirt", 19.99],
    ["Winter Parka", 179.0],
    ["Flannel Shirt", 44.99],
  ],
  Electronics: [
    ["Wireless Headphones", 79.99],
    ["Bluetooth Speaker", 59.99],
    ["USB-C Hub", 34.99],
    ["Mechanical Keyboard", 99.0],
    ["Webcam 1080p", 69.5],
  ],
  Home: [
    ["Ceramic Mug Set", 24.99],
    ["Desk Lamp", 39.99],
    ["Throw Blanket", 29.99],
    ["Storage Basket", 21.5],
    ["Scented Candle", 14.99],
  ],
  Sports: [
    ["Yoga Mat", 29.99],
    ["Dumbbell Pair 10lb", 44.99],
    ["Insulated Water Bottle", 22.99],
    ["Camping Backpack 40L", 109.0],
    ["Resistance Bands Set", 18.99],
  ],
};

const adjectives = ["", "Classic", "Everyday", "Premium", "Lightweight", "Limited"];

// build ~150 products by combining adjectives with the base items
function buildProducts() {
  const products = [];
  let vendorIndex = 0;

  for (const category of Object.keys(catalog)) {
    for (const adjective of adjectives) {
      for (const [baseName, basePrice] of catalog[category]) {
        const name = adjective ? `${adjective} ${baseName}` : baseName;
        // small price wobble so the variants are not all identical
        const price = Math.round((basePrice + (adjective.length % 5) * 3) * 100) / 100;
        const vendor = vendors[vendorIndex % vendors.length];
        vendorIndex++;

        products.push({
          name,
          description: `${name} — sold by ${vendor.vendorName}. Sample product for the ShopStack demo catalog.`,
          price,
          category,
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName,
          imageUrl: "",
          // spread the dates out a bit so "newest" sorting is visible
          createdAt: new Date(Date.now() - products.length * 86400000),
        });
      }
    }
  }
  return products;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  console.log("Cleared old products");

  const products = buildProducts();
  await Product.insertMany(products);
  console.log(`Inserted ${products.length} products from ${vendors.length} vendors`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
