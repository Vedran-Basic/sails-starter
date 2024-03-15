/**
 * @api {POST} /api/v1/$apiNameWithoutSuffix$/$entityCamelCase$/filter  Filter $entityLowerCaseSpaceSeparatedPlural$
 * @apiName filter$entityPascalCase$
 * @apiGroup $entityGroupCamelCase$
 * @apiVersion 1.0.0
 * @apiDescription Filter $entityLowerCaseSpaceSeparatedPlural$
 *
 * @apiHeader {string} accessToken ERP access token
 *
 * @apiParam (GB ROUTE PARAMS) {string} type="protected" GB route type
 *
 * @apiParam {number} [page=1] Page number (for pagination)
 * @apiParam {number} [limit=10] Number of results on page (for pagination)
 * @apiParam {string{..255}} [keywords=""] Search keywords
 * @apiParam {array{object}} [filters] Array of filter objects
 * @apiParam {string{..255}} [filters.key] Type of entity for filtering
 * @apiParam {any} [filters.value] Value of entity type. Value can be string, number, boolean, array or object. If object is sent, key is condition
 * @apiParam {object} [sort] Sort object
 * @apiParam {string{..255}} [sort.param] Sort parameter name  (required for sorting only)
 * @apiParam {string="ASC","DESC"} [sort.order] Sort order (required for sorting only)
 * @apiParam {boolean} [list] List data or standard data
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *    "page": 1,
 *    "limit": 10,
 *    "keywords": "some string",
 *    "filters": [
 *      {
 *        "key": "name",
 *        "value": "Lorem Ipsum"
 *      },
 *      ...
 *    ],
 *    "sort": {
 *      "key": "name",
 *      "order": "asc"
 *    }
 *  }
 */

module.exports = {

  friendlyName: 'Filter $entityLowerCaseSpaceSeparatedPlural$',

  description: 'Filter $entityLowerCaseSpaceSeparatedPlural$',

  inputs: {
    page: {
      type: 'number',
      defaultsTo: 1
    },
    limit: {
      type: 'ref',
      custom: (limit) => {
        return _.isNumber(limit) || (typeof limit === 'string' && limit === 'no-limit');
      }
    },
    keywords: {
      type: 'string'
    },
    filters: {
      type: 'ref'
    },
    sort: {
      type: 'ref'
    }
  },

  exits: {
    success: {
      responseType: 'ok',
      description: 'List of $entityLowerCaseSpaceSeparatedPlural$'
    },
    negotiate: {
      responseType: 'negotiate'
    }
  },

  /**
   * @description ORM filter route
   */
  fn: async function (inputs, exits) {

    let apiKey = this.req._gbox.apiKey.id;

    let query = {
      where: {apiKey: apiKey},
      limit: inputs.limit || null,
      skip: (inputs.limit * (inputs.page - 1)) || 0
    };

    // add sort
    if (!_.isEmpty(inputs.sort)) query.sort = `${inputs.sort.param} ${inputs.sort.order}`;

    // add filters
    if (inputs.filters) _.each(inputs.filters, filter => query.where[filter.key] = filter.value);

    //add search
    if (inputs.keywords) {
      let keywords = inputs.keywords.split(' ');

      query.where.or = [];
      _.each(keywords, keyword => query.where.or.push(
        {name: { 'like': `%${keyword}%` }},
        {description: { 'like': `%${keyword}%` }}
      ));
    }

    // get data
    let [data, count] = await Promise.all([
      sails.dbSwitch.wrapQuery($entityPascalCase$.find(query)),
      sails.dbSwitch.wrapQuery($entityPascalCase$.count({ where: query.where }))
    ]);

    return exits.success({
      records: data,
      totalRecords: count,
      totalPages: (inputs.limit) ? Math.ceil(count / inputs.limit) : 1
    });

  },

  /**
   * @description Custom filter route - list and query builder
   */
  fn: async function (inputs, exits) {

    let apiData = this.req._gbox;

    let listHeaders;   // if list is requested, get list settings
    if (inputs.select && inputs.select.length) listHeaders = inputs.select;
    if (inputs.list) {
      let settings = await sails.helpers.internal.getusersettings('lists', '$entityPascalCaseList$', apiData);
      let checked = _.filter(settings.lists[0].values, {isChecked: true});
      if (checked) listHeaders = _.map(_.orderBy(checked, ['orderNo'], ['asc']), 'value');
      if (!listHeaders.length) return exits.success({records: [], totalRecords: 0, totalPages: 1})
    }

    let {rawData, totals} = await $entityPascalCase$.filter$entityPascalCasePlural$(inputs, listHeaders, apiData.apiKey.id, inputs.list);

    let $entityCamelCase$Data
    if (inputs.list && rawData.length) {
      $entityCamelCase$Data = await $entityPascalCase$.transformToListJson(rawData, listHeaders);
    } else {
      $entityCamelCase$Data = await $entityPascalCase$.transformToJson(rawData, listHeaders);
    }


    return exits.success({
      records: $entityCamelCase$Data,
      totalRecords: totals,
      totalPages: (inputs.limit && inputs.limit !== 'no-limit') ? Math.ceil(totals / inputs.limit) : 1
    });

  }
};
