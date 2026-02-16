const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
    key_id: "YOUR_KEY_ID",
    key_secret: "YOUR_KEY_SECRET"
});

app.post("/create-order", async (req, res) => {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR"
    });

    res.json(order);
});

app.post("/verify-payment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
        .createHmac("sha256", "YOUR_KEY_SECRET")
        .update(sign)
        .digest("hex");

    if (expectedSign === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
