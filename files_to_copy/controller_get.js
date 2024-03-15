/**
 * @api {GET} /api/v1/warehouse/assetLabel/get/:id  Get asset label
 * @apiName getAssetLabel
 * @apiGroup assets
 * @apiVersion 1.0.0
 * @apiDescription Get asset label
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id assetLabel id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/warehouse/assetLabel/get/1
 *
 */

module.exports = {

  friendlyName: 'Get asset label',

  description: 'Get asset label',

  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok',
      description: 'asset label details'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {

    let apiData = this.req._gbox;
    let apiKeyId = apiData.apiKey.id

    let assetLabel = await sails.dbSwitch.wrapQuery(AssetLabel.findOne({id: inputs.id, apiKey: apiKeyId}).populate('assignees'));

    if (assetLabel) {
      assetLabel.createdBy = await PopulateService.populateUserForm(apiKeyId, assetLabel.createdBy);
      if (assetLabel.assignees) assetLabel.assignees = await PopulateService.populateMoreUsersForm(_.map(assetLabel.assignees, 'user'), apiKeyId)
    }

    return exits.success(assetLabel ? assetLabel : {});
  }
};
