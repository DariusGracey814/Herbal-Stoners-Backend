const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

    console.log(stripeFormattedProducts);

    // Initialize Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: stripeFormattedProducts,
      mode: "payment",
      success_url:
        "https://herbal-stoner-frontend.web.app/herbal-stoners/purchase-successful",
      cancel_url: "https://herbal-stoner-frontend.web.app/menu",
    });

    // Send user stripe checout session
    console.log(session.url);

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
