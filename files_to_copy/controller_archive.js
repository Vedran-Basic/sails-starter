/**
 * @api {DELETE} /api/v1/warehouse/assetLabel/archive/:id  Archive asset label
 * @apiName archiveAssetLabel
 * @apiGroup assets
 * @apiVersion 1.0.0
 * @apiDescription Archive asset label
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id assetLabel id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/warehouse/assetLabel/archive/1
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Archive asset label',

  description: 'Archive asset label',

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
      description: 'asset label archived'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {
    let apiData = this.req._gbox;

    let assetLabel = await sails.dbSwitch.wrapQuery(AssetLabel.updateOne({id: inputs.id, apiKey: apiData.apiKey.id}).set({archived: true}));

    activityLog(apiData.loggedUser, 'moved_to_archive', {id:assetLabel.id , type: `assetLabel`, name: assetLabel.name});
    return exits.success();
  }
};
