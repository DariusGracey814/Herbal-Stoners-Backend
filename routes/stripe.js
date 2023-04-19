const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const stripeRouter = express.Router();

stripeRouter.get("/", (req, res) => {
  res.send("Server is running....");
});

stripeRouter.get("/test", (req, res) => {
  res.send("Testing Api Connection");
});

stripeRouter.post("/checkout", async (req, res) => {
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

module.exports = stripeRouter;
