const jsonata = require("jsonata");
const _ = require("lodash");

/**
 * Extract all paths from a template object
 * @param {object} template - part of the template
 * @returns {object} - an array of paths
 */
function extractPathsFromTemplate(template) {
    let paths = [];
    for (let [key, value] of Object.entries(template)) {
        paths = _.concat(paths, value);
    }
    return paths;
}

/**
 * find the longest common path given an array of paths
 * @param {object} paths - an array of paths (e.g. go.BP.id)
 * @returns - the longest common path(separated by dot)
 */
function findLongestCommonPath(paths) {
    let new_paths = [];
    for (let item of paths) {
        if (typeof item !== "string") {
            return null
        } else {
            new_paths.push(item.split('.'));
        }
    }
    if (new_paths.length === 1) {
        return paths[0]
    } else if (new_paths.length === 0) {
        return null
    }
    let common_path = [];
    let eql;
    for (let i = 0; i < new_paths[0].length; i++) {
        eql = false;
        for (let item of new_paths) {
            if (item[i] && item[i] === new_paths[0][i]) {
                eql = true;
            } else {
                eql = false;
            }
        }
        if (eql) {
            common_path.push(new_paths[0][i]);
        } else {
            break;
        }
    }
    if (common_path.length === 0) {
        return null;
    } else {
        return (common_path.join('.'));
    }
}

/**
 * Transform a single JSON object based on the template
 * @param {object} json_doc - the JSON object to be transformed
 * @param {object} template - the template on which the transform is based
 * @returns {object} - the transformed json object
 */
function transformSimpleObject(json_doc, template) {
    let new_doc = {};
    let val;
    let expression;
    for (let [key, value] of Object.entries(template)) {
        if (_.isString(value)) {
            expression = jsonata(value);
            val = [expression.evaluate(json_doc)];
        } else if (_.isArray(value)) {
            val = value.map(element => jsonata(element).evaluate(json_doc));
        }
        val = val.filter(item => !(_.isUndefined(item)));
        if (_.isEmpty(val)) continue;
        if(val.length === 1) val = val[0];
        new_doc[key] = val;
    }
    return new_doc;
}

/**
 * Remove common prefix from template
 * @param {object} template - part of the template on which the transform is based
 * @param {string} common_path - the longest common path which all keys in the template share
 * @returns {object} - new template of which the common path has been removed
 */
function removeCommonPathFromTemplate(template, common_path) {
    if (typeof common_path !== "string") {
        return template
    }
    common_path = common_path + '.';
    let new_template = {};
    let new_value;
    for (let [key, value] of Object.entries(template)) {
        if (typeof value === 'string') {
            if (_.startsWith(value, common_path)) {
                new_template[key] = _.trimStart(value, common_path);
            } else {
                new_template[key] = value;
            }
        } else if (_.isArray(value)) {
            new_value = [];
            for (let element of value) {
                if (_.startsWith(element, common_path)) {
                    new_value.push(_.trimStart(element, common_path));
                } else {
                    new_value.push(element);
                }
            }
            new_template[key] = new_value;
        }      
    }
    return new_template;
}

exports.findLongestCommonPath = findLongestCommonPath;
exports.transformSimpleObject = transformSimpleObject;
exports.removeCommonPathFromTemplate = removeCommonPathFromTemplate;
exports.extractPathsFromTemplate = extractPathsFromTemplate;