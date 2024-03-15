// PopulateModelsService.js - in api/services
module.exports = {

  populateUserForm: async function(userId, apiKeyId) {
    if (!userId) return null;
    let user = await sails.dbSwitch.wrapQuery(User.findOne({apiKey: apiKeyId, id: userId}).populate('details').populate('occupation').populate('contacts')).then(async data => {
      if (data) {
        if(data.details.profileImage) data.details.profileImage = await sails.dbSwitch.wrapQuery(Media.findOne({media: data.details.profileImage}))
      }
      return data;
    });
    user.details = _.pick(user.details, ['firstName', 'lastName', 'displayName', 'profileImage']);
    return _.pick(user, ['id', 'email', 'username', 'details', 'occupation', 'contacts', 'archived']);
  },

  populateMoreUsersForm: async function(userIds, apiKeyId) {
    if (!userIds.length) return [];
    let users = await sails.dbSwitch.wrapQuery(User.find({apiKey: apiKeyId, id: userIds}).populate('details').populate('occupation').populate('contacts')).then(async data => {
      if (data?.length) {
        let mediaHashes = _.chain(data).map(item => item.details.profileImage).filter(hash => !!hash).value();
        let mediaFiles = mediaHashes.length ? await sails.dbSwitch.wrapQuery(Media.find({media: mediaHashes})) : [];
        _.each(data, user => user.details.profileImage = _.find(mediaFiles, {media: user.details.profileImage}));
      }
      return data;
    });
    let response = [];
    for (let user of users) {
      user.details = _.pick(user.details, ['firstName', 'lastName', 'displayName', 'profileImage']);
      response.push(_.pick(user, ['id', 'email', 'username', 'details', 'occupation', 'contacts', 'archived']));
    }
    return response;
  },
};

