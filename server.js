// server.js
const express = require("express");
const cors = require("cors");
// Uncomment mongoose lines if using MongoDB
// const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// ------------------------
// Demo Data & In-memory cart
// ------------------------
const products = [
{
id: 1,
name: "Wireless Earphones",
price: 1200,
image: "/src/assets/wirelessearphones.jpg",
},
{
id: 2,
name: "Smart Watch",
price: 2000,
image: "/src/assets/smartwatch.jpg",
},
{
id: 3,
name: "Bluetooth Speaker",
price: 900,
image: "/src/assets/bluetoothspeaker.jpg",
},
{
id: 4,
name: "Laptop Stand",
price: 500,
image: "/src/assets/laptopstand.jpg",
},
{
id: 5,
name: "USB Type-C Cable",
price: 250,
image: "usbtpeccable.jpg",
},
];


let cart = []; // each item: { id, name, price, qty }

// ------------------------
// API Endpoints
// ------------------------
app.get("/api/products", (req, res) => {
res.json(products);
});

app.get("/api/cart", (req, res) => {
const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
res.json({ cart, total });
});

// Add to cart: { productId, qty }
app.post("/api/cart", (req, res) => {
const { productId, qty } = req.body;
const product = products.find((p) => p.id === productId);
if (!product) return res.status(404).json({ message: "Product not found" });

const existing = cart.find((c) => c.id === productId);
if (existing) existing.qty += qty || 1;
else cart.push({ id: product.id, name: product.name, price: product.price, qty: qty || 1 });

return res.json({ cart });
});

// Remove item by product id
app.delete("/api/cart/:id", (req, res) => {
const id = parseInt(req.params.id);
cart = cart.filter((item) => item.id !== id);
res.json({ cart });
});

// Checkout: expects { name, email } (cart is server-side)
app.post("/api/checkout", (req, res) => {
const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
const receipt = { total, timestamp: new Date().toISOString(), name: req.body.name || "", email: req.body.email || "" };
cart = []; // clear cart on checkout
res.json(receipt);
});

// Reset cart (for quick testing) - optional
app.post("/api/cart/reset", (req, res) => {
cart = [];
res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
