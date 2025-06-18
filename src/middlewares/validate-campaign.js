const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { ErrorReponse } = require("../utils");

const validateCampaign = [
  body("campaignName").notEmpty().withMessage("Campaign name is required"),
  body("campaignDescription").notEmpty().withMessage("Campaign description is required"),
  body("campaignObjective").notEmpty().withMessage("Campaign objective is required"),
  body("campaignType").notEmpty().withMessage("Campaign type is required"),
  body("baseCost").isInt({ min: 1 }).withMessage("Base bid must be greater than 0"),
  body("budgetLimit").isInt({ min: 1 }).withMessage("Budget limit must be a positive integer"),
  body("demographic").notEmpty().withMessage("Demographic is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("interval").optional().isInt({ min: 0 }),
  body("maxBidCap").optional().isInt({ min: 0 }),
  body("scheduleStartDate").optional().isString(),
  body("scheduleEndDate").optional().isString(),
  body("selectedDays").notEmpty().withMessage("Selected days are required"),
  body("timeSlot").notEmpty().withMessage("Time slot is required"),

  // Validate adDevices as JSON string and check its structure
  body("adDevices").custom(value => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("adDevices must be a non-empty array");
      }
      parsed.forEach(device => {
        if (!device.name) {
          throw new Error("Each device in adDevices must have a 'name'");
        }
      });
      return true;
    } catch (err) {
      throw new Error("Invalid adDevices format: must be a valid JSON array of objects");
    }
  }),

  // Validate targetRegions as JSON string and check array
  body("targetRegions").custom(value => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("targetRegions must be a non-empty array");
      }
      return true;
    } catch (err) {
      throw new Error("Invalid targetRegions format: must be a valid JSON array");
    }
  }),

  // Validate productType JSON with a `name`
  body("productType").custom(value => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      if (!parsed.name || typeof parsed.name !== "string") {
        throw new Error("productType must be an object with a valid 'name' field");
      }
      return true;
    } catch (err) {
      throw new Error("Invalid productType format: must be a valid JSON object");
    }
  }),

  // FINAL handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = [];

      const seen = new Set();
      errors.array().forEach(err => {
        if (!seen.has(err.param)) {
          errorMessages.push({ message: err.msg });
          seen.add(err.param);
        }
      });

     ErrorReponse(res,StatusCodes.NOT_FOUND,errorMessages);
    }

    next();
  }
];

module.exports = validateCampaign;
