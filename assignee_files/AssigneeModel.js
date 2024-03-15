'use strict'

const Model = use('Model')
const addStandardTraits = use('App/Helpers/AddStandardTraits')

class AssigneeModel extends Model {

    static boot() {
        super.boot()
        addStandardTraits(this)
    }


    static get table() {
        return 'core_advertisement_associates'
    }

    static get Serializer() {
        return 'App/Models/Serializers/Base'
    }

    static get _AttributeConfig() {
        return 'App/Models/Advertisement/Attributes/AdAssociate'
    }

}

module.exports = AssigneeModel
