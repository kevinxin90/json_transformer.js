[![Build Status](https://travis-ci.com/kevinxin90/json_transformer.js.svg?branch=master)](https://travis-ci.com/kevinxin90/json_transformer.js)
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/json_transformer.js/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/json_transformer.js?branch=master)
<a href="https://github.com/kevinxin90/smartapi-kg.js#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
<a href="https://www.npmjs.com/package/@biothings-explorer/json-transformer" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@biothings-explorer/json-transformer.svg">
  </a>

# Welcome to @biothings-explorer/json-transformer 👋

A nodejs module to transform JSON output based on template

### 🏠 [Homepage](https://github.com/kevinxin90/json_transformer.js)

## Install

```sh
npm i @biothings-explorer/json-transformer
```

## Usage

- Import and Initialize

    ```javascript
    const transform = require("@biothings-explorer/json-transformer")
    ```

- Transform JSON object based on template file

  - Transform Plain JSON Object

    ```javascript
    const json_doc = {'ensemblgene': 1017};
    // the template is a JSON object, with value as the field from json_doc to be transformed and the key as the field to be transformed to
    const template = {'ensembl': 'ensemblgene'};
    transform(json_doc, template); // returns {'ensembl': 1017}
    ```

  - Transform Nested JSON Object

    ```javascript
    let json_doc = {
        'ensembl': {
            'gene': 1017
        }
    };
    let template = {'ensembl': 'ensembl.gene'};
    transform(json_doc, template); // returns {'ensembl': 1017}
    ```

  - Nested Template

    ```javascript
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
    let res = transform(json_doc, template); //returns {'ensembl': 1017, 'pathway': [{'id': 'WP123', 'name': 'aaa'}, {'id': 'WP1234', 'name': 'aaaa'}]}
    ```

## Run tests

```sh
npm run test
```

## Author

👤 **Jiwen Xin**

* Website: http://github.com/kevinxin90
* Github: [@kevinxin90](https://github.com/kevinxin90)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kevinxin90/json_transformer.js/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Jiwen Xin](https://github.com/kevinxin90).<br />
This project is [ISC](https://github.com/kevinxin90/json_transformer.js/blob/master/LICENSE) licensed.