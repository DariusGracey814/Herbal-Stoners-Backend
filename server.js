const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());
// app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const stripeRouter = require("./routes/stripe");
app.use("/", stripeRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
