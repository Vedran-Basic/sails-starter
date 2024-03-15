/**
 * @api {GET} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/get/:id  Get $entityLowerCaseSpaceSeparated$
 * @apiName get$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription Get $entityLowerCaseSpaceSeparated$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number{int(11)}} id $entityCamelCase$ id
 *
 * @apiParamExample {json} Request-Example:
 * /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/get/1
 *
 */

module.exports = {

  friendlyName: 'Get $entityLowerCaseSpaceSeparated$',

  description: 'Get $entityLowerCaseSpaceSeparated$',

  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok',
      description: '$entityLowerCaseSpaceSeparated$ details'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {

    let apiData = this.req._gbox;
    let apiKeyId = apiData.apiKey.id

    let $entityCamelCase$ = await sails.dbSwitch.wrapQuery($entityPascalCase$.findOne({id: inputs.id, apiKey: apiKeyId}).populate('assignees'));

    if ($entityCamelCase$) {
      $entityCamelCase$.createdBy = await PopulateService.populateUserForm(apiKeyId, $entityCamelCase$.createdBy);
      if ($entityCamelCase$.assignees) $entityCamelCase$.assignees = await PopulateService.populateMoreUsersForm(_.map($entityCamelCase$.assignees, 'user'), apiKeyId)
    }

    return exits.success($entityCamelCase$ ? $entityCamelCase$ : {});
  }
};
