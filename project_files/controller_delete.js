/**
 * @api {DELETE} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/delete/:id  Delete $entityLowerCaseSpaceSeparated$
 * @apiName delete$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription Delete $entityLowerCaseSpaceSeparated$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id $entityCamelCase$ id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/delete/1
 *
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Delete $entityLowerCaseSpaceSeparated$',

  description: 'Delete $entityLowerCaseSpaceSeparated$',

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
      description: '$entityLowerCaseSpaceSeparated$ deleted'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {
    let apiData = this.req._gbox;

    let $entityCamelCase$ = await sails.dbSwitch.wrapQuery($entityPascalCase$.destroyOne({id: inputs.id, apiKey: apiData.apiKey.id}));

    activityLog(apiData.loggedUser, 'deleted', {id:$entityCamelCase$.id , type: `$entityCamelCase$`, name: $entityCamelCase$.name});
    return exits.success();
  }
};
