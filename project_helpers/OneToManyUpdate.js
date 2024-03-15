const _isObject = require('lodash/isObject')
const _isEqual = require('lodash/isEqual')
const _differenceWith = require('lodash/differenceWith')
const _difference = require('lodash/difference')

module.exports = {
    separateData(existingData, receivedData) {

        const createData = receivedData.filter((data) =>
            !data.hasOwnProperty("id")
        )

        const updateData = []
        const deleteData = []

        for (let existing of existingData) {
            const foundData = receivedData.find((data) => data.id === existing.id)

            if (foundData) {
                updateData.push(foundData)
            } else {
                deleteData.push(existing.id)
            }
        }

        return { createData, updateData, deleteData }
    },

    /**
     * @description Separate one to many references, use 'compareByKeys' param to separate array of objects
     * (e.g. if you need})
     * @returns {{createData: *[], deleteData: *[]}
     */
    separateArrayReferences(existingRefArray, receivedRefArray, compareByKeys = []) {

        let response = {createData: [], deleteData: []}
        if (!existingRefArray || !receivedRefArray) return response

        if (receivedRefArray.every(item => _isObject(item) && compareByKeys.length)) {

            response.createData = _differenceWith(receivedRefArray, existingRefArray, _isEqual)
            for (let existing of existingRefArray) {
                const foundData = receivedRefArray.find((data) => data.id === existing.id)

                if (!foundData) {
                    response.deleteData.push(existing.id)
                }
            }
        } else if (receivedRefArray.every(item => typeof item === 'string') || receivedRefArray.every(item => typeof item === 'number')){
            response.deleteData = _difference(existingRefArray, receivedRefArray)
            response.createData = _difference(receivedRefArray, existingRefArray)
        }

        return response
    },


}
