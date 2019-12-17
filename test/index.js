const transform = require("../index");
const expect = require("chai").expect;


describe("test main function", () => {
    it("test if input json doc is empty", () => {
        let json_doc = {};
        let template = {'ensembl': "ensembl.gene"};
        let res = transform(json_doc, template);
        expect(res).to.be.empty;
    })

    it("test simple input", () => {
        let json_doc = {'ensemblgene': 1017};
        let template = {'ensembl': 'ensemblgene'};
        let res = transform(json_doc, template);
        expect(res).to.be.an("object").deep.equals({'ensembl': 1017});
    })

    it("test nested json doc input", () => {
        let json_doc = {'ensembl': {'gene': 1017}};
        let template = {'ensembl': 'ensembl.gene'};
        let res = transform(json_doc, template);
        expect(res).to.be.an("object").deep.equals({'ensembl': 1017});
    })

    it("test a mix of simple and complext paths", () => {
        let json_doc = {'ensembl': {'gene': 1017}, 'wikipathway': [{'id': 'WP123', 'name': 'aaa'}, {'id': 'WP1234', 'name': 'aaaa'}]};
        let template = {'ensembl': 'ensembl.gene', 'pathway': {'id': 'wikipathway.id', 'name': 'wikipathway.name'}};
        let res = transform(json_doc, template);
        expect(res).to.be.an("object").deep.equals({'ensembl': 1017, 'pathway': [{'id': 'WP123', 'name': 'aaa'}, {'id': 'WP1234', 'name': 'aaaa'}]});
    })
})