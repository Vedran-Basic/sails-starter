/**
 * @api {PATCH} /api/v1/warehouse/assetLabel/restore/:id  Restore asset label
 * @apiName restoreAssetLabel
 * @apiGroup assets
 * @apiVersion 1.0.0
 * @apiDescription Restore asset label
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id assetLabel id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/warehouse/assetLabel/restore/1
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Restore asset label',

  description: 'Restore asset label',

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
      description: 'asset label restored'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {
    let apiData = this.req._gbox;

    let assetLabel = await sails.dbSwitch.wrapQuery(AssetLabel.updateOne({id: inputs.id, apiKey: apiData.apiKey.id}).set({archived: false}));

    activityLog(apiData.loggedUser, 'restored_from_archive', {id:assetLabel.id , type: `assetLabel`, name: assetLabel.name});
    return exits.success();
  }
};
