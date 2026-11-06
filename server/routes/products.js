const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products
// Supports: q (keyword), category, minPrice, maxPrice,
// sort (price, -price, newest), page, limit
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.q) {
      const regex = new RegExp(req.query.q, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    let sortOption = { createdAt: -1 }; // newest first by default
    if (req.query.sort === "price") sortOption = { price: 1 };
    if (req.query.sort === "-price") sortOption = { price: -1 };
    if (req.query.sort === "newest") sortOption = { createdAt: -1 };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const items = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    // an invalid id throws a CastError — treat it as not found
    res.status(404).json({ error: "Product not found" });
  }
});

module.exports = router;
