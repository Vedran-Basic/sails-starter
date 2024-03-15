/**
 * @api {POST} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/create  Create $entityLowerCaseSpaceSeparated$
 * @apiName create$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription Create $entityLowerCaseSpaceSeparated$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {string{..100}} name Name of $entityLowerCaseSpaceSeparated$
 * @apiParam {string{..100}} uniqueNumber Unique number
 * @apiParam {string} [description=""] Description - text
 * @apiParam {number{int(11)}} [label] Label assigned to $entityLowerCaseSpaceSeparated$
 * @apiParam {array{int(11)}} [assignees] Assignees - user ids array
 * @apiParam {boolean} [booleanExample=false] Boolean attribute example
 *
 *
 * @apiParamExample {json} Request-Example: Default request (required params)
 *  {
 *     "name": "Name of $entityLowerCaseSpaceSeparated$",
 *  }
 * @apiParamExample {json} Request-Example: Full request
 * {
 *     "name": "Name of $entityLowerCaseSpaceSeparated$",
 *     "booleanExample": false,
 *     "description": "Some description text",
 *     "uniqueNumber": "UNIQ-1",
 *     "label": 1,
 *     "assignees": [1906, 1921]
 * }
 */
const activityLog = require('gbox-helper/gb/activityLog');
module.exports = {

  friendlyName: 'Create $entityLowerCaseSpaceSeparated$',

  description: 'Create $entityLowerCaseSpaceSeparated$',

  inputs: {

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
      description: '$entityLowerCaseSpaceSeparated$ created'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  fn: async function (inputs, exits) {

    let apiData = this.req._gbox
    inputs.apiKey = apiData.apiKey.id;
    inputs.createdBy = apiData.loggedUser.id;

    let $entityCamelCase$;
    await sails.dbSwitch.wrapTransaction(async (db) => {

      // cloning inputs because some inputs can be lost (sails framework modifies payload after this action)
      $entityCamelCase$ = await $entityPascalCase$.create(_.omit(inputs, ['assignees'])).fetch().usingConnection(db);

      if (inputs.hasOwnProperty('assignees')) {
        let assignees = _.map(inputs.assignees, assignee => ({user: assignee, $entityCamelCase$: $entityCamelCase$.id}));
        await Assignees.createEach(assignees).usingConnection(db);
      }
    })

    activityLog(apiData.loggedUser, 'created', {id: $entityCamelCase$.id , type: `$entityCamelCase$`, name: $entityCamelCase$.name});
    return exits.success($entityCamelCase$);
  }
};
