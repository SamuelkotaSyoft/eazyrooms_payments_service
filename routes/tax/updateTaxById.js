import express from "express";
import { matchedData } from "express-validator";
import verifyToken from "../../helpers/verifyToken.js";
import User from "../../models/userModel.js";
import Tax from "../../models/taxModel.js";
var router = express.Router();
//import models
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { updateTaxValidationSchema } from "../../validationSchema/taxSchema.js";

async function updateTax(req, res) {
  //request payload
  const uid = req.user_info.main_uid;
  const requestData = matchedData(req);
  const taxId = requestData.taxId;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "userId is required" });
    return;
  }

  //validate quantity
  if (!taxId) {
    res.status(400).json({ status: false, error: "taxId is required" });
    return;
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if user exists
    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //check if roomType exists
    const tax = await Tax.findById(taxId);
    if (!tax) {
      res.status(400).json({ status: false, error: "Invalid tax" });
    }

    //update roomtype
    const writeResult = await Tax.findByIdAndUpdate(
      { _id: requestData.taxId },
      requestData,
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
//new buyer
router.patch(
  "/",
  verifyToken,
  updateTaxValidationSchema,
  validateRequest,
  updateTax
);

export default router;
