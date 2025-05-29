const { body, validationResult } = require("express-validator");
const errorResponse = require("../utils/errorReponse");

const validateCampaign = [
  body("campaignName").notEmpty().withMessage("Campaign name is required"),
  body("campaignDescription").notEmpty().withMessage("Campaign description is required"),
  body("campaignObjective").notEmpty().withMessage("Campaign objective is required"),
  body("campaignType").notEmpty().withMessage("Campaign type is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("demographic").notEmpty().withMessage("Demographic is required"),
  body("timeSlot").notEmpty().withMessage("Time slot is required"),
  body("baseBid").isInt({ min: 1 }).withMessage("Base bid must be a greater than 1"),
  body("budgetLimit").isInt({ min: 1 }).withMessage("Budget limit must be a positive integer"),
  body("estimatedReach").isInt({ min: 1 }).withMessage("Estimated reach must be a positive integer"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  body("targetRegions").notEmpty().withMessage("Target regions are required"),
  body("cities").notEmpty().withMessage("Cities are required"),
  body("ageGroups").notEmpty().withMessage("Age groups are required"),
  body("selectedDays").notEmpty().withMessage("Selected days are required"),

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

     //Logger.error("Validation errors:", formattedErrors);
      return errorResponse(res, "Validation failed", 422, formattedErrors);
    }

    next();
  }
];

module.exports = validateCampaign;
