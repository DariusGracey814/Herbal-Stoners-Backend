const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.static("../public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      success_url: "http://localhost:3000/herbal-stoners/purchase-successful",
      cancel_url: "http://localhost:3000/menu",
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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
