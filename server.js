const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
// app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const stripeRouter = require("./routes/stripe");
app.use("/", stripeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
