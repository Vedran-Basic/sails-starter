/**
 * @api {POST} /api/v1/warehouse/assetLabel/create  Create asset label
 * @apiName createAssetLabel
 * @apiGroup assets
 * @apiVersion 1.0.0
 * @apiDescription Create asset label
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {string{..100}} name Name of asset label
 * @apiParam {string{..100}} uniqueNumber Unique number
 * @apiParam {string} [description=""] Description - text
 * @apiParam {number{int(11)}} [label] Label assigned to asset label
 * @apiParam {array{int(11)}} [assignees] Assignees - user ids array
 * @apiParam {boolean} [booleanExample=false] Boolean attribute example
 *
 *
 * @apiParamExample {json} Request-Example: Default request (required params)
 *  {
 *     "name": "Name of asset label",
 *  }
 * @apiParamExample {json} Request-Example: Full request
 * {
 *     "name": "Name of asset label",
 *     "booleanExample": false,
 *     "description": "Some description text",
 *     "uniqueNumber": "UNIQ-1",
 *     "label": 1,
 *     "assignees": [1906, 1921]
 * }
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Create asset label',

  description: 'Create asset label',

  inputs: {

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
      description: 'asset label created'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {

    let apiData = this.req._gbox
    inputs.apiKey = apiData.apiKey.id;
    inputs.createdBy = apiData.loggedUser.id;

    let assetLabel;
    await sails.dbSwitch.wrapTransaction(async (db) => {

      // cloning inputs because some inputs can be lost (sails framework modifies payload after this action)
      assetLabel = await AssetLabel.create(_.omit(inputs, ['assignees'])).usingConnection(db);

      if (inputs.hasOwnProperty('assignees')) {
        let assignees = _.map(inputs.assignees, assignee => ({user: assignee, assetLabel: assetLabel.id}));
        await Assignees.createEach(assignees).usingConnection(db);
      }
    })

    activityLog(apiData.loggedUser, 'created', {id: assetLabel.id , type: `assetLabel`, name: assetLabel.name});
    return exits.success(assetLabel);
  }
};
