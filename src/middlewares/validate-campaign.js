const { body, validationResult, matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { ErrorReponse } = require("../utils");

const validateCampaign = [
  // Basic string fields
  body("campaignName").notEmpty().withMessage("Campaign name is required"),
  body("campaignDescription").notEmpty().withMessage("Campaign description is required"),
  body("campaignObjective").notEmpty().withMessage("Campaign objective is required"),
  body("campaignType").notEmpty().withMessage("Campaign type is required"),
  body("demographic").notEmpty().withMessage("Demographic is required"),

  // Integer fields
  body("baseCost").isInt({ min: 1 }).withMessage("Base cost must be greater than 0"),
  body("budgetLimit").isInt({ min: 1 }).withMessage("Budget limit must be a positive integer"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("interval").optional().isInt({ min: 0 }).withMessage("Interval must be a non-negative integer"),
  body("maxBid").optional().isInt({ min: 0 }).withMessage("Max bid must be a non-negative integer"),
  body("minBid").optional().isInt({ min: 0 }).withMessage("Min bid must be a non-negative integer"),

  // Date fields
  body("scheduleStartDate")
    .optional()
    .isISO8601()
    .withMessage("scheduleStartDate must be a valid ISO date"),
  body("scheduleEndDate")
    .optional()
    .isISO8601()
    .withMessage("scheduleEndDate must be a valid ISO date"),

  // Array fields in stringified JSON format
  body("selectedDays").custom(value => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("selectedDays must be a non-empty array");
      }
      return true;
    } catch (err) {
      throw new Error("Invalid selectedDays format: must be a valid JSON array");
    }
  }),

  body("timeSlot").notEmpty().withMessage("Time slot is required"),

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

      return ErrorReponse(res, StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
    }

    
    req.body = matchedData(req, { includeOptionals: true });

    next();
  }
];

module.exports = validateCampaign;
