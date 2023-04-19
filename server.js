const express = require("express");
const stripe = require("stripe")(
  "sk_test_51MtGBHG6XH5BieNneklrLXSxlxY8grENegtuJKQGWjQr4q5qLC9VkWroSVDvTn32Wi57WYwQw50aJlYaNzR0Rtp000N7LOeEqh"
);
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://herbal-stoners-app.onrender.com",
      "herbal-stoner-frontend.web.app",
    ],
  })
);
// app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running....");
});

app.get("/test", (req, res) => {
  res.send("Testing Api Connection");
  res.send(JSON.stringify({ test: "Testing Api Connection" }));
});

app.post("/checkout", async (req, res) => {
  try {
    const items = req.body.customerCart;
    let stripeFormattedProducts = [];

    // Loop through and add product data to stripe item
    items.forEach((product) => {
      stripeFormattedProducts.push({
        price: product.stripePrice,
        quantity: product.quantity,
      });
    });

    // Initialize Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: stripeFormattedProducts,
      mode: "payment",
      success_url:
        "https://herbal-stoner-backend.web.app/herbal-stoners/purchase-successful",
      cancel_url: "https://herbal-stoner-backend.web.app/menu",
      automatic_tax: { enabled: true },
    });

    // Send user stripe checkout session
    res.send(
      JSON.stringify({
        url: session.url,
      })
    );

    // Error
  } catch (error) {
    return error;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
