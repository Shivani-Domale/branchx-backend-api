const UploadFile = require('./s3Uploader');


module.exports = {
    ErrorReponse: require('./errorHandler/errorReponse'),
    SuccessReposnse: require('./errorHandler/successReponse'),
    UploadFile,
    DeleteFileFromAWS: UploadFile.DeleteFileFromAWS,
    SendingEmailToUser: require('./send-Email'),
    GenerateBaseCostForCampaigns: require('./generatebasecostforcampaign')
}