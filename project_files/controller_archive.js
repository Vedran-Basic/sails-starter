/**
 * @api {DELETE} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/archive/:id  Archive $entityLowerCaseSpaceSeparated$
 * @apiName archive$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription Archive $entityLowerCaseSpaceSeparated$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id $entityCamelCase$ id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/archive/1
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Archive $entityLowerCaseSpaceSeparated$',

  description: 'Archive $entityLowerCaseSpaceSeparated$',

  inputs: {
    id: {
      description: 'Id of $entityLowerCaseSpaceSeparated$',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok',
      description: '$entityLowerCaseSpaceSeparated$ archived'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {
    let apiData = this.req._gbox;

    let $entityCamelCase$ = await sails.dbSwitch.wrapQuery($entityPascalCase$.updateOne({id: inputs.id, apiKey: apiData.apiKey.id}).set({archived: true}));

    activityLog(apiData.loggedUser, 'moved_to_archive', {id:$entityCamelCase$.id , type: `$entityCamelCase$`, name: $entityCamelCase$.name});
    return exits.success();
  }
};
