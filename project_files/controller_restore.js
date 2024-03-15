/**
 * @api {PATCH} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/restore/:id  Restore $entityLowerCaseSpaceSeparated$
 * @apiName restore$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription Restore $entityLowerCaseSpaceSeparated$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id $entityCamelCase$ id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/restore/1
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Restore $entityLowerCaseSpaceSeparated$',

  description: 'Restore $entityLowerCaseSpaceSeparated$',

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
      description: '$entityLowerCaseSpaceSeparated$ restored'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {
    let apiData = this.req._gbox;

    let $entityCamelCase$ = await sails.dbSwitch.wrapQuery($entityPascalCase$.updateOne({id: inputs.id, apiKey: apiData.apiKey.id}).set({archived: false}));

    activityLog(apiData.loggedUser, 'restored_from_archive', {id:$entityCamelCase$.id , type: `$entityCamelCase$`, name: $entityCamelCase$.name});
    return exits.success();
  }
};
