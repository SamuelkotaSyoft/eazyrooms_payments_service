import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./firebase-config.js";

const app = express();
const port = 3014;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use("/createTax", (await import("./routes/tax/createTax.js")).default);

app.use("/getAllTaxes", (await import("./routes/tax/getAllTaxes.js")).default);

app.use("/getTaxById", (await import("./routes/tax/getTaxById.js")).default);

app.use(
  "/updateTaxById",
  (await import("./routes/tax/updateTaxById.js")).default
);

app.use(
  "/deleteTaxById",
  (await import("./routes/tax/deleteTaxById.js")).default
);

/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`Paymnets service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Payments Service" });
});
