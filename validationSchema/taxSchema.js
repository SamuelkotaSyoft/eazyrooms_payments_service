import { body } from "express-validator";
import mongoose from "mongoose";
import taxModel from "../models/taxModel.js";

const createTaxValidationSchema = [
  body("name")
    .ltrim()
    .trim()
    .custom(async (name, { req }) => {
      const isTagExisting = await taxModel.findOne({
        location: req.body.location,
        name: new RegExp("^" + name + "$", "i"),
        status: true,
      });
      if (isTagExisting) {
        throw new Error("Tax already exists in location level");
      }
    }),
  body("location")
    .notEmpty()
    .custom((locationId) => mongoose.Types.ObjectId.isValid(locationId))
    .withMessage("Location is required and should be a valid ObjectId"),
  body("description").optional(),
  body("taxValue").isNumeric().notEmpty().withMessage("Tax value is required"),
];

const updateTaxValidationSchema = [
  body("taxId").notEmpty().withMessage("taxId is required"),
  body("name")
    .ltrim()
    .rtrim()
    .custom(async (name, { req }) => {
      const associatedLocation = await taxModel.findOne({
        _id: new mongoose.Types.ObjectId(req.body.taxId),
      });
      const isTaxExisting = await taxModel.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.body.taxId) },
        name: new RegExp("^" + name + "$", "i"),
        location: associatedLocation.location,
        status: true,
      });
      if (isTaxExisting) {
        throw new Error("Tax already exists in location level");
      }
    })

    .optional(),
  body("active").optional().isBoolean(),
  body("status").optional().isBoolean(),
  body("description").optional(),
  body("taxValue").optional(),
];

export { createTaxValidationSchema, updateTaxValidationSchema };
