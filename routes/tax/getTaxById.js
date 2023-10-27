import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
var router = express.Router();

//import models
import Tax from "../../models/taxModel.js";

//get user by id
router.get("/:taxId", verifyToken, async function (req, res) {
  //payload
  const uid = req.user_info.main_uid;
  const taxId = req.params.taxId;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    return res.status(400).json({ status: false, error: "userId is required" });
  }

  //validate orderId
  if (!taxId) {
    return res.status(200).json({ status: false, error: "taxId is required" });
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //query
    let query = Tax.findOne({ _id: taxId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
