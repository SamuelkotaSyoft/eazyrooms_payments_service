import express from "express";
var router = express.Router();

//import middleware
import verifyToken from "../../helpers/verifyToken.js";

//import models
import Tax from "../../models/taxModel.js";
import User from "../../models/userModel.js";
import { commonGetRequestValidationSchema } from "../../validationSchema/commonSchema.js";
import { matchedData } from "express-validator";
//get all roomTypes
router.get(
  "/:locationId",
  commonGetRequestValidationSchema,
  verifyToken,
  async function (req, res) {
    const uid = req.user_info.main_uid;
    const locationId = req.params.locationId;
    const requestData = matchedData(req);
    const role = req.user_info.role;

    try {
      if (role !== "propertyAdmin" && role !== "locationAdmin") {
        res.status(403).json({ status: false, error: "Unauthorized" });
        return;
      }
      //get user by uid
      const user = User.find({ uid: uid });

      if (!user) {
        res.status(400).json({ status: false, message: "User not found" });
      }

      let filterObj = { status: true };
      if (requestData?.active) {
        filterObj.active = requestData.active;
      }
      //query
      let query = Tax.find({
        location: locationId,
        status: true,
        ...filterObj,
      });

      //execute query
      const queryResult = await query.exec();

      //return result
      res.status(200).json({ status: true, data: queryResult });
    } catch (err) {
      res.status(500).json({ status: false, error: err });
    }
  }
);

export default router;
