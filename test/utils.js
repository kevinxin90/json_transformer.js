const expect = require("chai").expect;
const utils = require('../utils');

describe("Find longest common path", function() {

    it("return the common path if found, case 1", function() {
        _input = ['go.BP.id', 'go.BP.pubmed', 'go.BP.evidence'];
        res = utils.findLongestCommonPath(_input);
        expect(res).equals('go.BP');
    });

    it("return the common path if found, case 2", function() {
        _input = ['go.BP.id', 'go.BP.pubmed', 'go.CC.evidence'];
        res = utils.findLongestCommonPath(_input);
        expect(res).equals('go');
    });

    it("return null if common path is not found", function() {
        _input = ['go.BP.id', 'pathway.wikipathways.id', 'reactome.id'];
        res = utils.findLongestCommonPath(_input);
        expect(res).to.be.a('null');
    });
})
