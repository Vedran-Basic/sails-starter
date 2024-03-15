/**
 * @api {PATCH} /api/v1/warehouse/assetLabel/update/:id  Update asset label
 * @apiName updateAssetLabel
 * @apiGroup assets
 * @apiVersion 1.0.0
 * @apiDescription  Update asset label
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id assetLabel id
 * @apiParam {string{..100}} name Name of asset label
 * @apiParam {string{..100}} uniqueNumber Unique number
 * @apiParam {string} [description=""] Description - text
 * @apiParam {number{int(11)}} [label] Label assigned to asset label
 * @apiParam {array{int(11)}} [assignees] Assignees - user ids array
 * @apiParam {boolean} [booleanExample=false] Boolean attribute example
 *
 * @apiParamExample {json} Request-Example:
 *  /api/v1/warehouse/assetLabel/update/1
 *  {
 *     "name": "Name of asset label",
 *  }
 * @apiParamExample {json} Request-Example: Full request
 *  /api/v1/warehouse/assetLabel/update/1
 * {
 *     "name": "Name of asset label",
 *     "booleanExample": false,
 *     "description": "Some description text",
 *     "uniqueNumber": "UNIQ-1",
 *     "label": 1,
 *     "assignees": [1906, 1921]
 * }
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Update asset label',

  description: 'Update asset label',

  inputs: {
    id: {
      type: 'number',
      required: true
    },
    name: {
      description: 'Name of asset label',
      type: 'string',
      maxLength: 100,
      required: true
    },
    booleanExample: {
      description: 'Boolean attribute example',
      type: 'boolean'
    },
    description: {
      description: 'Some custom description available in tooltips',
      type: 'string'
    },
    uniqueNumber: {
      description: 'Some custom description available in tooltips',
      type: 'string',
      maxLength: 100
    },
    label: {
      description: 'Label assigned to asset label',
      type: 'number',
      allowNull: true
    },
    assignees: {
      description: 'Users assigned to asset label',
      type: 'number',
      allowNull: true
    },
  },

  exits: {
    success: {
      responseType: 'ok',
      description: 'asset label updated'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {

    let assetLabel = await sails.dbSwitch.wrapQuery(AssetLabel.updateOne({id: inputs.id, apiKey: this.req._gbox.apiKey.id}).set(inputs).fetch());

    activityLog(this.req._gbox.loggedUser, 'modified', {id:assetLabel.id , type: `assetLabel`, name: assetLabel.name});
    return exits.success();
  }
};
