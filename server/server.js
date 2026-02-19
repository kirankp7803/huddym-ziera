const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Data File Path
const DATA_FILE = path.join(__dirname, 'data.json');

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return { products: [], orders: [], users: [] };
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- Routes ---

// Get all products
app.get('/api/products', (req, res) => {
    const data = readData();
    res.json(data.products || []);
});

// Add a product (Admin)
app.post('/api/products', (req, res) => {
    const data = readData();
    const newProduct = {
        id: Date.now(),
        ...req.body
    };
    if (!data.products) data.products = [];
    data.products.push(newProduct);
    writeData(data);
    res.status(201).json(newProduct);
});

// Update a product (Admin)
app.put('/api/products/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.products.findIndex(p => p.id === id);

    if (index !== -1) {
        data.products[index] = { ...data.products[index], ...req.body, id }; // Ensure ID doesn't change
        writeData(data);
        res.json(data.products[index]);
    } else {
        res.status(404).send("Product not found");
    }
});

// Delete a product (Admin)
app.delete('/api/products/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const initialLength = data.products.length;
    data.products = data.products.filter(p => p.id !== id);

    if (data.products.length < initialLength) {
        writeData(data);
        res.json({ success: true, message: "Product deleted" });
    } else {
        res.status(404).send("Product not found");
    }
});

// Get all orders (Admin)
app.get('/api/orders', (req, res) => {
    const data = readData();
    res.json(data.orders || []);
});

// Place an order (Store)
app.post('/api/orders', (req, res) => {
    const data = readData();
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...req.body
    };
    if (!data.orders) data.orders = [];
    data.orders.push(newOrder); // In a real app, you'd validate stock here
    writeData(data);
    res.status(201).json(newOrder);
});

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay Instance (Use Test Credentials)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourKeySecretHere'
});

// ... existing code ...

// Create Razorpay Order
app.post('/api/payment/create-order', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const options = {
            amount: amount * 100, // Amount in paisa
            currency: currency,
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Error creating order");
    }
});

// Verify Payment
app.post('/api/payment/verify', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YourKeySecretHere')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).send("Error verifying payment");
    }
});

// Newsletter Subscription
app.post('/api/subscribe', (req, res) => {
    const data = readData();
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!data.subscriptions) {
        data.subscriptions = [];
    }

    if (data.subscriptions.includes(email)) {
        return res.status(409).json({ message: "Email is already subscribed" });
    }

    data.subscriptions.push(email);
    writeData(data);

    res.status(200).json({ message: "Successfully subscribed to newsletter!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
