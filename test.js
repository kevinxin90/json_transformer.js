var jsonata = require("jsonata");
const _ = require("lodash");

console.log(_.trimStart('wikipathway.ida', 'wikipathway.'));
var data = {
    "FirstName": "Fred",
    "Surname": "Smith",
    "Age": 28,
    "Address": [{
      "Street": "Hursley Park",
      "City": "Winchester",
      "Postcode": "SO21 2JN"
    }],
    "gene": [
        {'pathway': {'id': 1}},
        {'pathway': {'id': 2}},
        {'pathway': {'id': 3}}
    ],
    "Phone": [
      {
        "type": "home",
        "number": "0203 544 1234"
      },
      {
        "type": "office",
        "number": "01962 001234"
      },
      {
        "type": "office",
        "number": "01962 001235"
      },
      {
        "type": "mobile",
        "number": "077 7700 1234"
      }
    ],
    "Email": [
      {
        "type": "work",
        "address": ["fred.smith@my-work.com", "fsmith@my-work.com"]
      },
      {
        "type": "home",
        "address": ["freddy@my-social.com", "frederic.smith@very-serious.com"]
      }
    ],
    "Other": {
      "Over 18 ?": true,
      "Misc": null,
      "Alternative.Address": {
        "Street": "Brick Lane",
        "City": "London",
        "Postcode": "E1 6RF"
      }
    }
  }

let data2 = [{'kevin': {'sookie': 3}}, {'kevin': {'sookie': 2}}]
var expression = jsonata("kevin.sookie");
var result = expression.evaluate(data2); 
eval('delete data.' + 'gene.pathway');
let a = {'1': 2, '1': 3};
