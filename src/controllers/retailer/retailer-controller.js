const { Logger } = require("../../config");
const { RetailerService } = require("../../services");
const { StatusCodes } = require('http-status-codes');
const { SuccessReposnse, ErrorReponse } = require('../../utils');

const fetchApprovedCampaigns = async (req, res) => {
  try {
    const fetchApproveCampains = await RetailerService.getAllApprovedCampaigns();
    SuccessReposnse(res, "Approved Campaigns", StatusCodes.OK, fetchApproveCampains);
  } catch (error) {
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};


module.exports = {
    fetchApprovedCampaigns
};