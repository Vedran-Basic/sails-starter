const $entityPascalCase$ = use('App/Models/$entityGroupPascalCase$/$entityPascalCase$')
const Base = use('App/Repositories/Base')
const {separateData} = use('App/Helpers/OneToManyUpdate')
const _pick = require('lodash/pick')
const throwError = use('App/Helpers/ThrowError')

class $entityPascalCase$Repository extends Base {
    constructor() {
        super($entityPascalCase$)
        this.parentColumn = '$parentColumn$'
    }

    get MainValidator() {
        return 'App/Validators/$entityGroupPascalCase$/$entityPascalCase$'
    }

    get _ParentModel() {
        return 'App/Models/$entityGroupPascalCase$/$entityPascalCase$'
    }

    async getFilteredResponseData(body, listSelects, records) {
        const serialized = await this.serialize(records)
        if (body.list) {
            if(!listSelects || !listSelects.length) return throwError(400, 'nothing is selected. add selects to preferences.')
            let list = this.MainModel.formGBoxList(serialized.data, listSelects)
            return {
                totalPages: Math.ceil(serialized.pagination.total / serialized.pagination.perPage),
                totalRecords: serialized.pagination.total,
                records: list.records
            }
        } else {
            let records = serialized.data
            if (listSelects && listSelects.length) records = records.map(record => _pick(record, listSelects));
            return {
                records,
                totalPages: Math.ceil(serialized.pagination.total / serialized.pagination.perPage),
                totalRecords: serialized.pagination.total
            }
        }
    }

    async getParent(parentId, apiKeyId) {
        let ParentModel = use(this._ParentModel)
        return await ParentModel.query()
            .transacting(this.getTransaction())
            .whereApp(apiKeyId)
            .whereIdentifier(parentId)
            .with('$entityCamelCasePlural$Ref')
            .first()
    }

    async createMany(arrayOfParams, forceParams = {}) {

        const arrayOfPromises = []

        for (let param of arrayOfParams) {
            arrayOfPromises.push(this.create(param, forceParams))
        }

        return await Promise.all(arrayOfPromises)
    }

    async updateMany(instance, updateData, forceParams = {}) {

        const instancesToUpdate = await this.MainModel.query()
            .whereIn("id", updateData.map((data) => data.id))
            .where(this.parentColumn, instance.id)
            .fetch()

        let arrayOfPromises = []
        for (let instanceToUpdate of instancesToUpdate.rows) {
            const singleUpdateData = updateData.find((data) => data.id === instanceToUpdate.id)

            arrayOfPromises.push(this.update(instanceToUpdate, singleUpdateData, forceParams))
        }

        return await Promise.all(arrayOfPromises)
    }

    async deleteMany(parentInstance, deleteData) {

        return await this.MainModel.query().transacting(this.getTransaction())
            .where(this.parentColumn, parentInstance.id)
            .whereIn('id', deleteData.map(item => item.id))
            .delete()

    }

    async saveOneToMany(parentInstance, { updateData, createData, deleteData }, forceParams) {

        if (updateData.length) {
            await this.updateMany(parentInstance, updateData, forceParams)
        }

        if (createData.length) {
            await this.createMany(createData, forceParams)
        }

        if (deleteData.length) {
            await this.deleteMany(parentInstance, deleteData)
        }
    }

}

module.exports = $entityPascalCase$Repository
