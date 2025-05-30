const { body, validationResult } = require("express-validator");
const errorResponse = require("../utils/errorReponse");

const validateCampaign = [
  body("adDeviceShow").notEmpty().withMessage("Ad device show is required"),
  body("ageGroups").notEmpty().withMessage("Age groups are required"),
  body("baseBid").isInt({ min: 1 }).withMessage("Base bid must be greater than 0"),
  body("budgetLimit").isInt({ min: 1 }).withMessage("Budget limit must be a positive integer"),
  body("campaignName").notEmpty().withMessage("Campaign name is required"),
  body("campaignDescription").notEmpty().withMessage("Campaign description is required"),
  body("campaignObjective").notEmpty().withMessage("Campaign objective is required"),
  body("campaignType").notEmpty().withMessage("Campaign type is required"),
  body("creativeFile").optional().isString(),
  body("creativeType").optional().isString(),
  body("demographic").notEmpty().withMessage("Demographic is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("interval").optional().isInt({ min: 0 }),
  body("maxBidCap").optional().isInt({ min: 0 }),
  body("scheduleDate").optional().isString(),
  body("scheduleEndDate").optional().isString(),
  body("selectedDays").notEmpty().withMessage("Selected days are required"),
  body("slopePreference").optional().isString(),
  body("targetRegions").notEmpty().withMessage("Target regions are required"),
  body("timeSlot").notEmpty().withMessage("Time slot is required"),

  // Final validation middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = [];

      const seenFields = new Set();

      errors.array().forEach((err) => {
        if (!seenFields.has(err.param)) {
          formattedErrors.push({
            field: err.param,
            message: err.msg,
          });
          seenFields.add(err.param);
        }
      });

      return errorResponse(res, "Validation failed", 422, formattedErrors);
    }

    next();
  }
];

module.exports = validateCampaign;
