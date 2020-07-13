const jsonata = require("jsonata");
const _ = require("lodash");
const commonpath = require("common-path-prefix");

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
    if (!(Array.isArray(paths))) {
        return null
    }
    for (let item of paths) {
        if (typeof item !== "string") {
            return null
        }
    }
    if (paths.length === 1) {
        return paths[0]
    }
    let common_path = commonpath(paths, '.');
    if (common_path.endsWith('.')) {
        return common_path.slice(0, -1)
    } else {
        return null
    }
}

/**
 * Transform a simple JSON object based on the template
 * @param {object} json_doc - the JSON object to be transformed
 * @param {object} template - the template on which the transform is based
 * @returns {object} - the transformed json object
 */
function transformSimpleObject(json_doc, template) {
    let new_doc = {};
    let val;
    let expression;
    if (_.isEmpty(json_doc)) {
        return new_doc;
    }
    for (let [key, value] of Object.entries(template)) {
        if (_.isString(value)) {
            expression = jsonata(value);
            val = [expression.evaluate(json_doc)];
        } else if (_.isArray(value)) {
            val = value.map(element => jsonata(element).evaluate(json_doc));
        }
        val = val.filter(item => !(_.isUndefined(item)));
        if (_.isEmpty(val)) continue;
        if (val.length === 1) val = val[0];
        new_doc[key] = val;
    }
    return new_doc;
}

/**
 * Transform an array of simple JSON object based on the template
 * @param {array} json_doc - the JSON object to be transformed
 * @param {object} template - the template on which the transform is based
 * @returns {array} - the transformed json object
 */
function transformArrayOfSimpleObject(json_doc, template) {
    if (_.isArray(json_doc)) {
        return json_doc.map((_doc) => transformSimpleObject(_doc, template))
    } else {
        return json_doc
    }
}

/**
 * Transform a complex JSON object based on the template
 * @param {object} json_doc - the JSON object to be transformed
 * @param {object} template - the template on which the transform is based
 * @returns {object} - the transformed json object
 */
function transformComplexObject(json_doc, template) {
    let new_doc = {};
    let trimmed_json_doc;
    let trimmed_template;
    let val;
    let expression;
    const paths = extractPathsFromTemplate(template);
    console.log('paths', paths);
    const common_path = findLongestCommonPath(paths);
    console.log('common path', common_path)
    if (common_path) {
        trimmed_json_doc = jsonata(common_path).evaluate(json_doc);
        trimmed_template = removeCommonPathFromTemplate(template, common_path);
    } else {
        trimmed_json_doc = json_doc;
        trimmed_template = template;
    }
    console.log('trimmed', trimmed_json_doc)
    if (_.isArray(trimmed_json_doc)) {
        new_doc = transformArrayOfSimpleObject(trimmed_json_doc, trimmed_template)
    } else {
        new_doc = transformSimpleObject(trimmed_json_doc, trimmed_template);
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
                new_template[key] = value.substring(common_path.length,);
            } else {
                new_template[key] = value;
            }
        } else if (_.isArray(value)) {
            new_value = [];
            for (let element of value) {
                if (_.startsWith(element, common_path)) {
                    new_value.push(element.substring(common_path.length,));
                } else {
                    new_value.push(element);
                }
            }
            new_template[key] = new_value;
        }
    }
    return new_template;
}

/**
 * distinguish simple paths and complex paths from template
 * @param {object} template - the template which transformation is based on
 */
function separateSimpleAnComplexPaths(template) {
    let simple_path_template = {};
    let complex_path_template = {};
    for (let [key, value] of Object.entries(template)) {
        if (_.isString(value)) {
            simple_path_template[key] = value;
        } else if (_.isArray(value) && _.isString(value[0])) {
            simple_path_template[key] = value;
        } else {
            complex_path_template[key] = value;
        }
    }
    return [simple_path_template, complex_path_template];
}

exports.findLongestCommonPath = findLongestCommonPath;
exports.transformSimpleObject = transformSimpleObject;
exports.transformArrayOfSimpleObject = transformArrayOfSimpleObject;
exports.removeCommonPathFromTemplate = removeCommonPathFromTemplate;
exports.extractPathsFromTemplate = extractPathsFromTemplate;
exports.transformComplexObject = transformComplexObject;
exports.separateSimpleAnComplexPaths = separateSimpleAnComplexPaths;