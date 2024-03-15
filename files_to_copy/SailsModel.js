/**
 * AssetLabel.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    datastore: 'gbERP',
    tableName: 'ware_asset_labels',
    schema: true,

    attributes: {

        name: {
            description: 'AssetLabel name',
            type: 'string',
            columnType: 'nvarchar(255)',
            required: true
        },

        archived: {
            description: 'Visible only in archive, no activities can be performed to it',
            type: 'boolean',
            defaultsTo: false
        },

        booleanExample: {
            description: 'Is asset label true or false',
            type: 'boolean',
            defaultsTo: false
        },

        description: {
            description: 'Description of asset label',
            type: 'string',
        },

        uniqueNumber: {
            description: 'Unique number generated in pattern',
            type: 'string',
            columnType: 'nvarchar(45)',
            required: true
        },

        // ============ //
        // ASSOCIATIONS //
        // ============ //

        // relatedModel: {
        //     description: 'Relation to a related model.',
        //     model: 'relatedModel',
        //     required: true
        // },

        // category: {
        //     description: 'Relation to a AssetLabel category model.',
        //     model: 'assetLabelCategory'
        // },

        // relatedAssetLabels: {
        //     description: 'Relation to a AssetLabel model.',
        //     collection: 'AssetLabel',
        //     via: 'assetLabel'
        // },

        // media: {
        //     description: 'Relation to a asset label media model.',
        //     collection: 'assetLabelMedia',
        //     via: 'asset'
        // },

        // ===================== //
        // EXTERNAL ASSOCIATIONS //
        // ===================== //

        createdBy: {
            description: 'Relation to a User model in ERP DB (users table).',
            type: 'number',
            columnType: 'integer(11)',
            allowNull: true
        },

        apiKey: {
            description: 'Relation to a api key model in CRM DB (apiKeys table).',
            type: 'number',
            columnType: 'integer(11)',
            required: true
        },

    },

    customToJSON: function () {

        return _.omit(this, ['createdAt', 'updatedAt', 'apiKey']);
    },

    getAssetLabelAttributes: function (filterParams, columns, apiKey, language) {

        let attributes = {
            id: {
                select: ` ware_asset_labels.id `,
                filter: ` ware_asset_labels.id  `,
                sort: ` ware_asset_labels.id `
            },
            createdAt: {
                select: ` ware_asset_labels.createdAt `,
                filter: ` ware_asset_labels.createdAt  `,
                sort: ` ware_asset_labels.createdAt `,
                inputType: 'date'
            },
            updatedAt: {
                select: ` ware_asset_labels.updatedAt `,
                filter: ` ware_asset_labels.updatedAt  `,
                sort: ` ware_asset_labels.updatedAt `,
                inputType: 'date'
            },
            name: {
                select: ` ware_asset_labels.name `,
                filter: ` ware_asset_labels.name  `,
                sort: ` ware_asset_labels.name `,
                keywordSearch: ` ware_asset_labels.name `
            },
            archived: {
                select: ` ware_asset_labels.archived `,
                filter: ` ware_asset_labels.archived  `,
                sort: ` ware_asset_labels.archived `
            },
            booleanExample: {
                select: ` ware_asset_labels.booleanExample `,
                filter: ` ware_asset_labels.booleanExample  `,
                sort: ` ware_asset_labels.booleanExample `
            },
            description: {
                select: ` ware_asset_labels.description `,
                filter: ` ware_asset_labels.description  `,
                sort: ` ware_asset_labels.description `
            },
            uniqueNumber: {
                select: ` ware_asset_labels.uniqueNumber `,
                filter: ` ware_asset_labels.uniqueNumber  `,
                sort: ` ware_asset_labels.uniqueNumber `
            },
            label: {
                select: ` (SELECT JSON_OBJECT('id', id, 'name', name, 'color', color) FROM !!sometable!! WHERE id = ware_asset_labels.label) `,
                filter: ` d.label `,
                sort: ` (SELECT name FROM !!sometable!! WHERE id = ware_asset_labels.label) `
            },
            createdBy: {
                select: ` (SELECT JSON_OBJECT('id', details.user,
                                        'details', JSON_OBJECT('firstName', details.firstName, 'lastName', details.lastName, 'displayName', details.displayName, 'profileImage', details.profileImage))
                    FROM usr_userDetails details
                    WHERE details.user = ware_asset_labels.createdBy) `,
                filter: ` ware_asset_labels.createdBy `,
                sort: ` (SELECT userDetails.displayName FROM usr_userDetails userDetails WHERE userDetails.user = ware_asset_labels.createdBy) `,
                keyword: ` (SELECT userDetails.displayName FROM usr_userDetails userDetails WHERE userDetails.user = ware_asset_labels.createdBy) `
            },
            createdByImage: {
                select: ` (SELECT userDetails.profileImage FROM usr_userDetails userDetails WHERE userDetails.user = ware_asset_labels.createdBy) `
            },
        }
        return attributes;
    },

    filterAssetLabels: async function (reqParams, columns, apiData, isDynamicList = false) {
        let assetLabelAttributes = AssetLabel.getassetLabelAttributes();   // get attribute queries

        // PAGINATION
        let limit = (reqParams.limit) ? ` LIMIT ${reqParams.limit} ` : '';
        let offset = (reqParams.page && reqParams.limit) ? ` OFFSET ${(reqParams.page - 1) * reqParams.limit} ` : '';

        // FILTER DATA
        let whereQuery = '';
        if (reqParams.filters && reqParams.filters.length) {
            // going through filter params
            for (let filter of reqParams.filters) {
                if (filter.hasOwnProperty('or')) {
                    whereQuery += ' AND ('
                    let first = true;
                    for (let filterChild of filter.or) {
                        if (assetLabelAttributes[filterChild.key] && assetLabelAttributes[filterChild.key].filter) {
                            if (!first) whereQuery += ' OR '
                            whereQuery += ` ${GenerateFilterQueryService.generateFilterQuery(assetLabelAttributes[filterChild.key], filterChild.value, filterChild.key, 'assetLabel', 'ware_asset_labels')}`
                            first = false;
                        }
                    }
                    whereQuery += ') '
                } else {
                    if (assetLabelAttributes[filter.key] && assetLabelAttributes[filter.key].filter)
                        whereQuery += ` AND ${GenerateFilterQueryService.generateFilterQuery(assetLabelAttributes[filter.key], filter.value, filter.key, 'assetLabel', 'ware_asset_labels')}`
                }
            }
        }

        // SEARCH DATA
        let searchFields = [];
        for (const [key, value] of Object.entries(assetLabelAttributes)) {
            if (value.hasOwnProperty('keywordSearch')) searchFields.push(value.keywordSearch);
        }

        let keywords = (reqParams.keywords) ? reqParams.keywords.trim().split(' ') : '';  // get keyword
        if (keywords !== '' && searchFields.length) {
            let first = true;
            whereQuery += ' AND (';

            for (let keyword of keywords) {
                if (!first) whereQuery += ' AND ';
                whereQuery += ` ( `;

                let firstOr = true
                for (let searchField of searchFields) {
                    if (!firstOr) whereQuery += ` OR `;
                    whereQuery += sails.knexERP().parse(` ${searchField} LIKE ? `, [`%${keyword}%`]).toString()
                    firstOr = false;
                }

                whereQuery += ')';
                first = false;
            }
            whereQuery += ')';
        }

        // SORT DATA
        let sort = ' ORDER BY ';
        if (!_.isEmpty(reqParams.sort)) {
            let sortParam = reqParams.sort.param;
            if (sortParam !== '' && assetLabelAttributes.hasOwnProperty(sortParam) && assetLabelAttributes[sortParam].sort) sort += ` ${assetLabelAttributes[sortParam].sort} ${reqParams.sort.order}, `;
        }
        if (sort === ' ORDER BY ') sort += ` ${assetLabelAttributes.createdAt.sort} ASC, `
        sort += ` ${assetLabelAttributes.id.sort} ASC `

        // SELECT columns
        let mandatorySelectColumns = ['id'];
        if (isDynamicList) mandatorySelectColumns = ['id', 'archived', 'contactPerson'];
        let queryCols = '';

        for (let [index, column] of mandatorySelectColumns.entries()) {
            if (index > 0) queryCols += ',';
            if (assetLabelAttributes[column] && assetLabelAttributes[column].select) queryCols += ` ${assetLabelAttributes[column].select} AS "${column}"`;
        }

        if (!columns) columns = Object.keys(assetLabelAttributes)   // list settings from settingsApi or json select array from request
        for (let column of columns) {
            if (assetLabelAttributes[column] && assetLabelAttributes[column].select) queryCols += `, ${assetLabelAttributes[column].select} AS "${column}"`;
        }

        // BUILD QUERIES
        let query = `
          SELECT ${queryCols}
          FROM ware_asset_labels
          WHERE ware_asset_labels.apiKey = ${apiData.apiKey.id}
          ${whereQuery}
          ${sort}
          ${limit}
          ${offset}`;

        let totalQuery = `
          SELECT COUNT(ware_asset_labels.id) AS total
          FROM ware_asset_labels
          WHERE ware_asset_labels.apiKey=${apiData.apiKey.id}
          ${whereQuery}`;

        let rawData = await Promise.all([
            sails.knexERP().raw(query),
            sails.knexERP().raw(totalQuery)
        ]);

        return {rawData: rawData[0][0], totals: rawData[1][0][0].total};
    },

    mediaFilesFetch: async function(rawData) {
        let mediaHashes = _.reduce(rawData, (acc, dataItem) => {
            if (dataItem.createdByImage?.length) acc.push(dataItem.createdByImage);
            if (dataItem.createdBy && dataItem.createdBy.details.profileImage) acc.push(dataItem.createdBy.details.profileImage);
            return acc;
        }, []);

        mediaHashes = _.filter(mediaHashes, hash => !!hash);
        let mediaFiles = mediaHashes.length ? await sails.dbSwitch.wrapQuery(Media.find({media: mediaHashes})) : [];
        return mediaFiles;
    },


    transformToListJson: async function (assetLabelData, columns) {

        let response = {
            headers: [],
            body: []
        };

        let allAttributes = AssetLabel.getAssetLabelAttributes();
        let mediaFiles = await AssetLabel.mediaFilesFetch(assetLabelData);

        // add headers
        for (let header of columns) {
            let rowHeader = {
                name: header,
                sendParam: header,
                sort: !!allAttributes[header]?.sort
            };
            response.headers.push(rowHeader);
        }


        // add list data
        for (let data of assetLabelData) {
            let row = {
                entityId: data.id,
                isArchived: data.archived,
                data: []
            };

            for (let header of columns) {
                let rowData = {
                    type: '',
                    displayValue: data[header]
                };

                // set column data type
                rowData.type = 'text';
                if (header === 'label') rowData.type = 'label';
                if (['createdByImage'].includes(header)) rowData.type = 'avatar';
                if (header === 'createdAt' || header === 'updatedAt') rowData.type = 'date';

                // handle object relations with name prop - select must be json object select
                if (['category', 'label'].includes(header)) {
                    if (data[header]) rowData.displayValue = data.name;
                    else rowData.displayValue = ''
                }

                // set column data type
                if (['createdByImage'].includes(header)) {
                    rowData.displayValue = {}
                    if (data[header]) {
                        let media = mediaFiles.find(file => file.media === data[header])
                        rowData.displayValue = media ? media : {};
                    }
                    if (header === 'createdByImage' && data.createdBy) rowData.displayValue.displayName = data.createdBy.details.displayName;
                }

                if (['createdBy'].includes(header)) {
                    if (data[header]) rowData.displayValue = data[header].details.displayName;
                    else rowData.displayValue = '';
                }

                row.data.push(rowData)
            }

            response.body.push(row);
        }


        return response;
    },

    transformToJson: async function (rawData, columns = []) {
        let response = [];

        let mediaFiles = await AssetLabel.mediaFilesFetch(assetLabelData);

        for (let rawItem of rawData) {

            let formattedData = bindProperties(rawItem);

            if (columns.includes('category') && (!formattedData.category || !formattedData.category.id) ) formattedData.category = null;

            if(columns.includes('createdBy') && formattedData.createdBy && formattedData.createdBy.details.profileImage){
                formattedData.createdBy.details.profileImage = _.find(mediaFiles, {media: formattedData.createdBy.details.profileImage});
            }

            if(columns.includes('createdByImage') && formattedData.createdByImage){
                formattedData.createdByImage = _.find(mediaFiles, {media: formattedData.createdByImage});
            }

            response.push(formattedData);
        }

        return response;
    },

};

function bindProperties(rawObject) {
    let finalObject = {}
    _.each(rawObject, (v, k) => {
        if (k.includes('.')) {
            let parts = k.split('.');
            // handling case when property is object, but id is already assigned to it
            if (Number.isInteger(finalObject[parts[0]])) finalObject[parts[0]] = {id: finalObject[parts[0]]};
            (finalObject[parts[0]]) ? finalObject[parts[0]][parts[1]] = v : finalObject[parts[0]] = {[parts[1]]: v};
        } else {
            finalObject[k] = v;
        }
    });
    return finalObject;
}
