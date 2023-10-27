import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
var router = express.Router();

//import models
import Tax from "../../models/taxModel.js";
//new buyer
router.delete("/:taxId", verifyToken, async function (req, res) {
  //request payload
  const taxId = req.params.taxId;

  const role = req.user_info.role;

  //validate taxId
  if (!taxId) {
    res.status(400).json({ status: false, error: "taxId is required" });
    return;
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if tax exists
    const tax = Tax.findById(taxId);
    if (!tax) {
      res.status(400).json({ status: false, error: "Invalid tax" });
      return;
    }

    //delete roomType
    const writeResult = await Tax.deleteOne({ _id: taxId });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
