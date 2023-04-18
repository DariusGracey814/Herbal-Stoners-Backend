const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.static("/dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Testing");
});

// Send user cart to stripe - Create stripe checkout session
app.post("/checkout", async (req, res) => {
  try {
    const items = req.body.customerCart;
    console.log(items);
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
        "https://herbal-stoners-app.web.app/herbal-stoners/purchase-successful",
      cancel_url: "https://herbal-stoners-app.web.app/menu",
    });

    // Send user stripe checout session
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

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
