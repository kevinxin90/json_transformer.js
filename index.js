const utils = require('./utils');
const _ = require("lodash");


function transform(json_doc, template){
    let transformed_json_doc;
    [simple_template, complex_template] = utils.separateSimpleAnComplexPaths(template);
    console.log(simple_template, complex_template);
    transformed_json_doc = utils.transformSimpleObject(json_doc, simple_template);
    for (let [key, value] of Object.entries(complex_template)) {
        if (_.isArray(value)) {
            transformed_json_doc[key] = value.map((tmpl) => utils.transformComplexObject(json_doc, tmpl));
        } else {
            transformed_json_doc[key] = utils.transformComplexObject(json_doc, value);
        }
    }
    return transformed_json_doc;
}

module.exports = transform;