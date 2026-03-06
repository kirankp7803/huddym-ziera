const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5001;

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

// Get orders for a specific user (Store)
app.get('/api/orders/user/:id', (req, res) => {
    const data = readData();
    const userId = req.params.id; // This can be email or phone
    const userOrders = (data.orders || []).filter(order =>
        order.customer?.email === userId || order.customer?.phone === userId
    );
    res.json(userOrders);
});

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay Instance (Use Test Credentials)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SNt908JQ0wkKvS',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'qofgjBF4FlTar8VS8TJ3nMUj'
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
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'qofgjBF4FlTar8VS8TJ3nMUj')
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

// User Authentication - Signup
app.post('/api/signup', (req, res) => {
    console.log("Signup request received:", req.body);
    try {
        const data = readData();
        const { name, email, password, mobile } = req.body;

        if (!data.users) data.users = [];

        if (data.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            console.log("Signup conflict: Email already registered:", email);
            return res.status(409).json({ message: "Email already registered" });
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In a real app, hash this!
            mobile: mobile || ''
        };

        data.users.push(newUser);
        writeData(data);

        console.log("Signup success:", email);
        res.status(201).json({
            message: "User registered successfully",
            user: { name: newUser.name, email: newUser.email, mobile: newUser.mobile, loggedIn: true }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error during signup" });
    }
});

// User Authentication - Login (Password-based)
app.post('/api/login', (req, res) => {
    try {
        const data = readData();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = data.users?.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (user) {
            res.json({
                message: "Login successful",
                user: { name: user.name, email: user.email.toLowerCase(), mobile: user.mobile, loggedIn: true }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error during login" });
    }
});

// User Authentication - Login (OTP-based mock)
app.post('/api/login-otp', (req, res) => {
    const { mobile, otp } = req.body;
    const data = readData();

    // Mock OTP verification
    if (otp === '1234') {
        let user = data.users?.find(u => u.mobile === mobile);
        if (!user) {
            // Create a guest user or ask to signup
            // For now, let's just allow it
            user = { name: 'Guest User', mobile, email: '', loggedIn: true };
        }
        res.json({
            message: "Login successful",
            user: { ...user, loggedIn: true }
        });
    } else {
        res.status(401).json({ message: "Invalid OTP" });
    }
});

// Get User Profile (including addresses)
app.get('/api/user/profile/:id', (req, res) => {
    const data = readData();
    const identifier = req.params.id;
    const user = data.users?.find(u => u.email === identifier || u.mobile === identifier);

    if (user) {
        // Don't send password
        const { password, ...userProfile } = user;
        res.json(userProfile);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Update User Addresses
app.put('/api/user/addresses', (req, res) => {
    const data = readData();
    const { identifier, addresses } = req.body;
    const userIndex = data.users?.findIndex(u => u.email === identifier || u.mobile === identifier);

    if (userIndex !== -1) {
        data.users[userIndex].addresses = addresses;
        writeData(data);
        const { password, ...updatedUser } = data.users[userIndex];
        res.json({ message: "Addresses updated successfully", user: updatedUser });
    } else {
        res.status(404).json({ message: "User not found" });
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Global Error Handling to prevent crashes
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
