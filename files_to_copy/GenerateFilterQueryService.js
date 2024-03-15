// AttributeService.js - in api/services

//TODO: query injection (use sails knexerp parse)!!!!!!!!!!!!!

const moment = require('moment');
module.exports = {

    /**
     * @description Generates raw query for filtering data, based on key and value. Added entity string just in case of similar filter key
     * @returns {string}
     */
    generateFilterQuery: function (attributeData, filterValue, filterKey, entity, queryAlias) {
        let queryString = ' ';

        // first check attribute inputType - special query handling
        if (attributeData.hasOwnProperty('inputType')) {
            if (attributeData.inputType === 'customHandling') {
                queryString += this.customHandling(attributeData, filterValue, filterKey, entity);
            } else if (attributeData.inputType === 'date') {
                if(!Array.isArray(filterValue) || !filterValue.length ) throw new Error('Invalid "date" filter value type. Expected value type is array with at least 1 member!')
                if(filterValue.length === 1) {
                    queryString += sails.knexERP().parse(` ${attributeData.filter} BETWEEN ? AND ? `, [filterValue[0], filterValue[0] + 86399999]).toString();
                } else {
                  queryString += sails.knexERP().parse(` ${attributeData.filter} BETWEEN ? AND ? `, [filterValue[0], filterValue[1]]).toString();
                }
            } else if (attributeData.inputType === 'range') {
              if(!Array.isArray(filterValue) || !filterValue.length !== 2 ) throw new Error('Invalid "range" filter value type. Expected value type is array with 2 members - start and end!')
              queryString += sails.knexERP().parse(` ${attributeData.filter} BETWEEN ? AND ? `, [filterValue[0], filterValue[1]]).toString();
            } else if (attributeData.inputType === 'dateTime') {
                if(!Array.isArray(filterValue) || !filterValue.length ) throw new Error('Invalid "date" filter value type. Expected value type is array with at least 1 member!')
                if (filterValue.some(val => typeof val !== 'string' || !val.match(/^(?:[0-9]{2})?[0-9]{2}.[0-1]?[0-9].[0-3]?[0-9]$/i))) throw new Error('Invalid "date" value. Accepted date format is "YYYY-MM-DD" ("2020-05-31")')
                if (filterValue.length > 1) {
                  queryString += sails.knexERP().parse(` ${attributeData.filter} BETWEEN ? AND ? `, [filterValue[0], filterValue[1]]).toString();
                } else {
                  queryString += sails.knexERP().parse(` ${attributeData.filter} = ? `, [filterValue[0]]).toString();
                }
            }
            else if (attributeData.inputType === 'stringifiedArray') {
                if(!Array.isArray(filterValue) || !filterValue.length ) throw new Error('Invalid filter value type. Expected value type is array with at least 1 member!');
                queryString += ` (`;

                if (filterValue.length >= 1) {
                    let first = true;
                    for (let value of filterValue) {
                        if (!first) queryString += ` OR `;
                        // MAKE SURE attribute.filter DOESN'T SELECT NULL OR EMPTY STRING VALUES!!! - ELSE MYSQL ERROR
                        queryString += sails.knexERP().parse(` JSON_OVERLAPS(${attributeData.filter}, "?") `, [value]).toString();    // docs - https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#function_json-overlaps
                        first = false;
                    }
                }
                queryString += `)`;
            } else if (attributeData.inputType === 'array') {
                if(!Array.isArray(filterValue) || !filterValue.length ) throw new Error('Invalid filter value type. Expected value type is array with at least 1 member!');
                queryString += ` (`;

                if (filterValue.length >= 1) {
                    let first = true;
                    for (let value of filterValue) {
                        if (!first) queryString += ` OR `;
                        // MAKE SURE attribute.filter DOESN'T SELECT NULL OR EMPTY STRING VALUES!!! - ELSE MYSQL ERROR
                        queryString += sails.knexERP().parse(` JSON_OVERLAPS(${attributeData.filter}, "?") `, [value]).toString();    // docs - https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#function_json-overlaps
                        first = false;
                    }
                }
                queryString += `)`;
            } else if(attributeData.inputType === 'boolean') {
              if (typeof filterValue !== 'boolean' ) throw new Error('Invalid filter value type. Expected value type is boolean!');
              queryString += sails.knexERP().parse(` ${attributeData.filter} = ? `, [filterValue]).toString();
            }
        } else if (typeof filterValue === 'string') {
          queryString += sails.knexERP().parse(` (${attributeData.filter} = "?") `, [filterValue]).toString()
        } else if (typeof filterValue === 'number' || typeof filterValue === 'boolean') {
          queryString += sails.knexERP().parse(` (${attributeData.filter} = ?) `, [filterValue]).toString()
        } else if (filterValue === null) {
          queryString += ` (${attributeData.filter} IS NULL) `;
        } else if (_.isArray(filterValue) && filterValue.length) {
            queryString += ` ${attributeData.filter} IN (`;

            let first = true;
            _.each(filterValue, value => {
                if (!first) queryString += ', ';
                queryString += (typeof value === 'string') ? `"${value}"` : `${value}`;
                first = false;
            });

            queryString += `) `;
        } else if (_.isObject(filterValue)) {
            const key = Object.keys(filterValue)?.[0];
            if (key && sails.config.allowedDbOperators.includes(key)) {
                if (_.isArray(filterValue[key])) {
                    let first = true;
                    queryString += ' ( ';
                    _.each(filterValue[key], item => {
                        if (!first) queryString += ' AND ';
                        queryString += `${attributeData.filter} ${key} ${item}`;
                        first = false;
                    });
                    queryString += ' ) ';
                } else {
                    queryString += `${attributeData.filter} ${key} ${filterValue[key]}`;
                }
            }

        }

        return queryString;
    },

    /**
     * @description Similar logic to generateFilterQuery function, use for special handling - put inputType="customHandling" into attributeData for custom query handling
     */
    customHandling: function (attributeData, filterValue, filterKey, entity) {
        let queryString = ' ';
        return queryString;
    },

};
