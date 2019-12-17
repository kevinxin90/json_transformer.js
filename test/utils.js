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

    it("if input is not an array of string, return null", function() {
        _input = [null, 'go.BP.id', 'go.BP.pubmed'];
        res = utils.findLongestCommonPath(_input);
        expect(res).to.be.a('null');
    });

    it("if input array is empty, return null", function() {
        _input = [];
        res = utils.findLongestCommonPath(_input);
        expect(res).to.be.a('null');
    });

    it("if input array only has one string element, return that string", function() {
        _input = ['go.BP.id'];
        res = utils.findLongestCommonPath(_input);
        expect(res).equals(_input[0]);
    });
})

describe('Tranform a single object', function() {

    it('Test simple rename key', function() {
        let json_doc = {'ensemblgene': 1017};
        let template = {'ensembl': "ensemblgene"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: 1017});
    })

    it('Test simple rename key with extra field in template', function() {
        let json_doc = {'ensemblgene': 1017};
        let template = {'ensembl': "ensemblgene", 'hgnc': 'HGNC'};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: 1017});
    })

    it('Test simple rename key with extra field in json doc', function() {
        let json_doc = {'ensemblgene': 1017, 'HGNC': 1171};
        let template = {'ensembl': "ensemblgene"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: 1017});
    })

    it('Test simple rename key with field value as float', function() {
        let json_doc = {'ensemblgene': 1.017};
        let template = {'ensembl': "ensemblgene"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: 1.017});
    })

    it('Test simple rename key with field value as list', function() {
        let json_doc = {'ensemblgene': [1017, 1018]};
        let template = {'ensembl': "ensemblgene"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: [1017, 1018]});
    })

    it('Test simple rename key with field value as string', function() {
        let json_doc = {'ensemblgene': '1017'};
        let template = {'ensembl': "ensemblgene"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: '1017'});
    })

    it('Test nested key renaming with single key in template', function() {
        let json_doc = {'ensembl': {'gene': 1017}};
        let template = {'ensembl': "ensembl.gene"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({ensembl: 1017});
    })

    it('Test nested key renaming with multiple keys in template', function() {
        let json_doc = {'ensembl': {'gene': 1017, 'protein': '1018'}};
        let template = {'gene': "ensembl.gene", 'protein': "ensembl.protein"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({gene: 1017, protein: '1018'});
    })

    it('Test nested key renaming with multiple keys in template nested in different levels', function() {
        let json_doc = {'ensembl': {'gene': 1017}, 'protein1': '1018'};
        let template = {'gene': "ensembl.gene", 'protein': "protein1"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({gene: 1017, protein: '1018'});
    })

    it('return empty object if json doc and template does not match at all', function() {
        let json_doc = {'ensembl': {'gene': 1017}, 'protein1': '1018'};
        let template = {'gene': "ensembl.protein", 'protein': "protein2"};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').that.is.empty;
    })

    it('test if the value of the template key is an array', function() {
        let json_doc = {'ensembl': {'gene': 1017}, 'protein1': '1018', 'protein2': '1019'};
        let template = {'gene': "ensembl.gene", 'protein': ["protein2", "protein1"]};
        let res = utils.transformSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal({gene: 1017, protein:['1019', '1018']});
    })
})

describe('Tranform an array of single object', function() {

    it('Test simple rename key', function() {
        let json_doc = [{'ensemblgene': 1017}];
        let template = {'ensembl': "ensemblgene"};
        let res = utils.transformArrayOfSimpleObject(json_doc, template);
        expect(res).to.be.an('array').to.deep.equal([{ensembl: 1017}]);
    })

    it('Test nested key renaming with single key in template', function() {
        let json_doc = [{'ensembl': {'gene': 1017}}];
        let template = {'ensembl': "ensembl.gene"};
        let res = utils.transformArrayOfSimpleObject(json_doc, template);
        expect(res).to.be.an('array').to.deep.equal([{ensembl: 1017}]);
    })

    it('Test nested key renaming with multiple keys in template', function() {
        let json_doc = [{'ensembl': {'gene': 1017, 'protein': '1018'}}, {'ensembl': {'gene': 1019, 'protein': '1020'}}];
        let template = {'gene': "ensembl.gene", 'protein': "ensembl.protein"};
        let res = utils.transformArrayOfSimpleObject(json_doc, template);
        expect(res).to.be.an('array').to.deep.equal([{gene: 1017, protein: '1018'}, {gene: 1019, protein: '1020'}]);
    })

    it('return same object if json doc is not array', function() {
        let json_doc = {'ensembl': {'gene': 1017}, 'protein1': '1018'};
        let template = {'gene': "ensembl.protein", 'protein': "protein2"};
        let res = utils.transformArrayOfSimpleObject(json_doc, template);
        expect(res).to.be.an('object').to.deep.equal(json_doc);
    })
})

describe("remove common path from template", function() {
    it("test if common path is null", function() {
        let template = {'gene': 'ensembl.gene', 'variant': 'variant.id'};
        let common_path = null;
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal(template);
    })

    it("test on wikipathways case (the case fails on lodash trimstart)", function() {
        let template = {'id': 'wikipathways.id', 'name': 'wikipathways.name'};
        let common_path = 'wikipathways';
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal({'id': 'id', 'name': 'name'});
    })

    it("test if common path is not a string", function() {
        let template = {'gene': 'ensembl.gene', 'variant': 'variant.id'};
        let common_path = ['ensembl'];
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal(template);
    })

    it("test if common path is only at level one", function() {
        let template = {'gene': 'ensembl.gene', 'transcript': 'ensembl.transcript'};
        let common_path = 'ensembl';
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal({'gene': 'gene', 'transcript': 'transcript'});
    })

    it("test if common path is more than one level", function() {
        let template = {'gene': 'ensembl.gene.id', 'transcript': 'ensembl.gene.transcript'};
        let common_path = 'ensembl.gene';
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal({'gene': 'id', 'transcript': 'transcript'});
    })

    it("test if template is more than one level", function() {
        let template = {'gene': 'ensembl.gene.id', 'transcript': 'ensembl.transcript'};
        let common_path = 'ensembl';
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal({'gene': 'gene.id', 'transcript': 'transcript'});
    })

    it("test if one of the values in template is array", function() {
        let template = {'gene': ['ensembl.gene.id', 'ensembl.key'], 'transcript': 'ensembl.transcript'};
        let common_path = 'ensembl';
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal({'gene': ['gene.id', 'key'], 'transcript': 'transcript'});
    })

    it("test if template and common path does not match", function() {
        let template = {'gene': 'ensembl.gene.id', 'transcript': 'ensembl.transcript'};
        let common_path = 'ensembl1';
        let res = utils.removeCommonPathFromTemplate(template, common_path);
        expect(res).to.be.an('object').to.deep.equal(template);
    })
})

describe("test extract paths from template", () => {
    it("test if template is a simple object", () => {
        let template = {'gene': "ensembl.gene.id", 'transcript': "ensembl.transcript"};
        let res = utils.extractPathsFromTemplate(template);
        expect(res).to.be.an("array").of.length(2).to.include('ensembl.gene.id', 'ensembl.transcript');
    })

    it("test if the values of template contains array", () => {
        let template = {'gene': ["ensembl.gene.id", 'uniprot.gene'], 'transcript': "ensembl.transcript"};
        let res = utils.extractPathsFromTemplate(template);
        expect(res).to.be.an("array").of.length(3).to.include('ensembl.gene.id', 'uniprot.gene', 'ensembl.transcript');
        
    })
})

describe("test transform complex object", () => {
    it("test if all values at same level", () => {
        let json_doc = {'HGNC': '1771', 'wikipathway': [{'id': "WP123", 'name': 'keud'}, {'id': "WP1234", 'name': 'ke2ud'}]};
        let template = {'id': 'wikipathway.id', 'name': 'wikipathway.name'};
        let res = utils.transformComplexObject(json_doc, template);
        expect(res).to.be.an('array').to.deep.equal([{'id': "WP123", 'name': 'keud'}, {'id': "WP1234", 'name': 'ke2ud'}]);
    })
})

describe("test extract simple paths", () => {
    it("test if all simple paths are extracted", () => {
        let template = {'gene': 'gene.id', 'variant': ['rsid', 'dbsnp'], 'key1': 'aaa'};
        let res = utils.extractSimplePaths(template);
        expect(res).to.be.an('object').to.deep.equal(template);
    })

    it("test if complex paths are removed", () => {
        let template = {'gene': 'gene.id', 'variant': ['rsid', 'dbsnp'], 'key1': 'aaa', 'drug': {'id': 'drugbani.id', 'name': 'drugbank.name'}};
        let res = utils.extractSimplePaths(template);
        expect(res).to.be.an('object').to.deep.equal({'gene': 'gene.id', 'variant': ['rsid', 'dbsnp'], 'key1': 'aaa'});
    })
})