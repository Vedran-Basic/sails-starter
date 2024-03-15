const $entityPascalCase$ = use('App/Models/$entityGroupPascalCase$/$entityPascalCase$')
const Base = use('App/Repositories/Base')
const {separateData} = use('App/Helpers/OneToManyUpdate')
const _pick = require('lodash/pick')
const throwError = use('App/Helpers/ThrowError')

class $entityPascalCase$Repository extends Base {
    constructor() {
        super($entityPascalCase$)
        this.parentColumn = 'advertisement_id'
    }

    get MainValidator() {
        return 'App/Validators/Advertisement/AdAssociate'
    }

    get _ParentModel() {
        return 'App/Models/Advertisement/Advertisement'
    }

    async getParent(parentId, apiKeyId) {
        let ParentModel = use(this._ParentModel)
        return await ParentModel.query()
            .transacting(this.getTransaction())
            .whereApp(apiKeyId)
            .whereIdentifier(parentId)
            .with('adAssociatesRef')
            .first()
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
