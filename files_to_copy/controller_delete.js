/**
 * @api {DELETE} /api/v1/warehouse/assetLabel/delete/:id  Delete asset label
 * @apiName deleteAssetLabel
 * @apiGroup assets
 * @apiVersion 1.0.0
 * @apiDescription Delete asset label
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id assetLabel id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/warehouse/assetLabel/delete/1
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Delete asset label',

  description: 'Delete asset label',

  inputs: {
    id: {
      description: 'Id of asset label',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok',
      description: 'asset label deleted'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {
    let apiData = this.req._gbox;

    let assetLabel = await sails.dbSwitch.wrapQuery(AssetLabel.destroyOne({id: inputs.id, apiKey: apiData.apiKey.id}));

    activityLog(apiData.loggedUser, 'deleted', {id:assetLabel.id , type: `assetLabel`, name: assetLabel.name});
    return exits.success();
  }
};
