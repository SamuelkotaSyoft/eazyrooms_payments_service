import express from "express";
import { matchedData } from "express-validator";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import verifyToken from "../../helpers/verifyToken.js";
import Location from "../../models/locationModel.js";
import Property from "../../models/propertyModel.js";
import Tax from "../../models/taxModel.js";
import User from "../../models/userModel.js";
import { createTaxValidationSchema } from "../../validationSchema/taxSchema.js";
var router = express.Router();

async function createTax(req, res) {
  try {
    //request payload
    const uid = req.user_info.main_uid;
    const role = req.user_info.role;
    const requestData = matchedData(req);
    const locationId = requestData.location;

    //validate role
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }

    //validate user
    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //check if roomType exists
    const isTaxExist = await Tax.findOne({
      name: requestData.name,
      location: locationId,
    });
    if (isTaxExist) {
      res
        .status(400)
        .json({ status: false, error: [{ msg: "Tax already exists" }] });
      return;
    }
    //validate property
    const property = await Property.findOne({
      _id: user.property,
      status: true,
    });
    console.log(property);

    if (!property) {
      res
        .status(400)
        .json({ status: false, error: [{ msg: "Property not valid" }] });
      return;
    }

    //validate location
    const location = await Location.findOne({
      _id: locationId,
    });
    if (!location) {
      res
        .status(400)
        .json({ status: false, error: [{ msg: "Location not valid" }] });
      return;
    }

    //add room type
    const tax = new Tax({
      ...requestData,
      property: user.property,
      createdBy: user._id,
      updatedBy: user._id,
      active: true,
      status: true,
    });

    //save room type
    const writeResult = await tax.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
//create chatbot
router.post(
  "/",
  verifyToken,
  createTaxValidationSchema,
  validateRequest,
  createTax
);

export default router;
