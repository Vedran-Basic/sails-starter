const fs = require('fs-extra');
const path = require('path');
const {glob} = require("glob");


(async function () {

    let params = require('minimist')(process.argv.slice(2));
    console.log(params);
    let config = require(params.configPath);
    if (!params.configPath) {
        console.error('Missing configPath param!');
        return;
    }
    _checkConfig(config);
    //TODO: make config to be able to just create reference to main model (so no additional routes for)
    //TODO: make config to be able to just create assignees model (referenced to a user and specific entity) - manage, add and remove routes
    //TODO: inside all repositories add saveOneToMany and other methods instead of changing the api base repo!

    let sailsApiPath = `${config.mainGaussBoxPath}/erp/${config.apiName}`;
    if (!fs.pathExistsSync(sailsApiPath)) {
        console.error(`Invalid api name! Check if ${sailsApiPath} path exists!`);
        return;
    }
    await _makeCopyDir();
    await _replaceTextInFiles(config.replacementParams);
    let paths = await _makeSailsApiPaths(config);
    await _moveFilesToSailsApi(config, paths); // TODO: add checks for if file exists and print out which ones already exist!
    // TODO: ensure helpers that are used in generated CRUD files are inside api repo
    // for now OneToManyUpdate was missing in repo

    return;
})();


function _checkConfig(config) {
    if (!config.mainGaussBoxPath?.length) {
        console.error('Missing mainGaussBoxPath param inside config file!');
        return;
    }
    if (!config.apiName?.length) {
        console.error('Missing apiName param inside config file!');
        return;
    }

    let configReplaceValues = config.replacementParams;
    let requiredValues = ['$entityGroupPascalCase$', '$entityPascalCase$', '$apiNameWithSuffix$']
    for (let value of requiredValues) {
        if (!configReplaceValues[value]) {
            console.error(`Missing required replacement param '${value}'`);
            process.exit();
        }
    }
}


async function _makeCopyDir() {
    try {
        await fs.copy(path.join(__dirname, 'project_files'), (__dirname, 'files_to_copy'))
    } catch (e) {
        console.log(e)
        process.exit()
    }
}

async function _replaceTextInFiles(replacementPayload) {
    const {glob} = require('glob');
    const replace = require('replace-in-file');

    let formattedReplacementPayload = [];
    try {
        let from = [];
        let to = [];

        for (let [key, value] of Object.entries(replacementPayload)) {
            key = key.replaceAll('$', '\\$');
            from.push(new RegExp(`${key}`, 'g'));
            to.push(value);
        }

        //TEST END
        let result = await replace({files: path.join(__dirname, 'files_to_copy', '*'), from, to});
        console.log(result);
    } catch (e) {
        console.error(e);
        process.exit();
    }
}

async function _makeSailsApiPaths(config) {
    let apiPath = config.mainGaussBoxPath + '/erp/' + config.apiName;

    let controllerPath = path.join(apiPath, 'api', 'controllers', config.replacementParams.$entityCamelCase$);
    let modelPath = path.join(apiPath, 'api', 'models', config.replacementParams.$entityGroupPascalCase$);
    let servicesPath = path.join(apiPath, 'api', 'services');

    await Promise.all([
        fs.ensureDir(controllerPath),
        fs.ensureDir(modelPath),
        fs.ensureDir(servicesPath)
    ]);

    return {
        controllerPath,
        servicesPath,
        modelPath
    };
}


async function _moveFilesToSailsApi(config, paths) {
    const {
        controllerPath,
        modelPath,
        servicesPath
    } = paths;
    const replacementParams = config.replacementParams

    await Promise.all([
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_archive.js'), path.join(controllerPath, `archive.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_create.js'), path.join(controllerPath, `create.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_delete.js'), path.join(controllerPath, `delete.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_filter.js'), path.join(controllerPath, `filter.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_get.js'), path.join(controllerPath, `get.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_restore.js'), path.join(controllerPath, `restore.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'controller_update.js'), path.join(controllerPath, `update.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'GenerateFilterQueryService.js'), path.join(servicesPath, `GenerateFilterQueryService.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'PopulateService.js'), path.join(servicesPath, `PopulateService.js`)),
        fs.copy(path.join(__dirname, 'files_to_copy', 'SailsModel.js'), path.join(modelPath, `${replacementParams.$entityPascalCase$}.js`)),
    ])
    return;
}
