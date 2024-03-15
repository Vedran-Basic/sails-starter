/**
 * @api {PATCH} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/update/:id  Update $entityLowerCaseSpaceSeparated$
 * @apiName update$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription  Update $entityLowerCaseSpaceSeparated$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id $entityCamelCase$ id
 * @apiParam {string{..100}} name Name of $entityLowerCaseSpaceSeparated$
 * @apiParam {string{..100}} uniqueNumber Unique number
 * @apiParam {string} [description=""] Description - text
 * @apiParam {number{int(11)}} [label] Label assigned to $entityLowerCaseSpaceSeparated$
 * @apiParam {array{int(11)}} [assignees] Assignees - user ids array
 * @apiParam {boolean} [booleanExample=false] Boolean attribute example
 *
 * @apiParamExample {json} Request-Example:
 *  /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/update/1
 *  {
 *     "name": "Name of $entityLowerCaseSpaceSeparated$",
 *  }
 * @apiParamExample {json} Request-Example: Full request
 *  /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/update/1
 * {
 *     "name": "Name of $entityLowerCaseSpaceSeparated$",
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

  friendlyName: 'Update $entityLowerCaseSpaceSeparated$',

  description: 'Update $entityLowerCaseSpaceSeparated$',

  inputs: {
    id: {
      type: 'number',
      required: true
    },
    name: {
      description: 'Name of $entityLowerCaseSpaceSeparated$',
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
      description: 'Label assigned to $entityLowerCaseSpaceSeparated$',
      type: 'number',
      allowNull: true
    },
    assignees: {
      description: 'Users assigned to $entityLowerCaseSpaceSeparated$',
      type: 'number',
      allowNull: true
    },
  },

  exits: {
    success: {
      responseType: 'ok',
      description: '$entityLowerCaseSpaceSeparated$ updated'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {

    let $entityCamelCase$ = await sails.dbSwitch.wrapQuery($entityPascalCase$.updateOne({id: inputs.id, apiKey: this.req._gbox.apiKey.id}).set(inputs).fetch());

    activityLog(this.req._gbox.loggedUser, 'modified', {id:$entityCamelCase$.id , type: `$entityCamelCase$`, name: $entityCamelCase$.name});
    return exits.success();
  }
};
