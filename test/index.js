const transform = require("../index");
const expect = require("chai").expect;


describe("test main function", () => {
    it("test if input json doc is empty", () => {
        let json_doc = {};
        let template = { 'ensembl': "ensembl.gene" };
        let res = transform(json_doc, template);
        expect(res).to.be.empty;
    })

    it("test simple input", () => {
        let json_doc = { 'ensemblgene': 1017 };
        let template = { 'ensembl': 'ensemblgene' };
        let res = transform(json_doc, template);
        expect(res).to.be.an("object").deep.equals({ 'ensembl': 1017 });
    })

    it("test nested json doc input", () => {
        let json_doc = {
            'ensembl': {
                'gene': 1017
            }
        };
        let template = { 'ensembl': 'ensembl.gene' };
        let res = transform(json_doc, template);
        expect(res).to.be.an("object").deep.equals({ 'ensembl': 1017 });
    })

    it("test a mix of simple and complext paths", () => {
        let json_doc = {
            'ensembl': {
                'gene': 1017
            },
            'wikipathway': [
                {
                    'id': 'WP123',
                    'name': 'aaa'
                },
                {
                    'id': 'WP1234',
                    'name': 'aaaa'
                }
            ]
        };
        let template = {
            'ensembl': 'ensembl.gene',
            'pathway': {
                'id': 'wikipathway.id',
                'name': 'wikipathway.name'
            }
        };
        let res = transform(json_doc, template);
        expect(res).to.be.an("object").deep.equals({ 'ensembl': 1017, 'pathway': [{ 'id': 'WP123', 'name': 'aaa' }, { 'id': 'WP1234', 'name': 'aaaa' }] });
    })

    it("test nested template and simple object", () => {
        let json_doc = {
            query: 'HP:0000791',
            _id: 'HP:0000791',
            _score: 1,
            parents: ['HP:0000787']
        };
        let template = { subclass_of: { HP: 'parents' } };
        let res = transform(json_doc, template);
        expect(res).to.have.property("subclass_of");
        expect(res["subclass_of"]).to.have.property("HP");
        expect(res["subclass_of"]["HP"][0]).to.equal("HP:0000787");
    })
})