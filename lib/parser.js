const fs = require('fs');
const osmosis = require('osmosis');
const path = require('path');
const utils = require(path.resolve('./lib/utils.js'));

module.exports = class Parser {
  // constructor
  constructor(config, source, encode) {
    this.source = source;
    this.encode = encode || 'utf8';
    this.config = {
      json: config
    };
    this.answer = {
      status: 'ok',
      result: null
    };
  }

  // workflow
  go() {
    this.getSource();
    this.getConfig();
    this.parse().then(data => {
      this.answer.result = utils.converter(data, this.config.model._types);
      console.log(JSON.stringify(this.answer, null, 2));
    });
  }

  // get html data source
  getSource() {
    try {
      this.source = fs.readFileSync(this.source, this.encode);
    } catch (err) {
      if (err.code = 'ENOENT') this.answer = { status: 'ko', error: 'file source not fount !' };
      else throw err;
    }
  }

  // get json config
  getConfig() {
    try {
      this.config = this.generateConfig(JSON.parse(fs.readFileSync(this.config.json, this.encode)));
    } catch (err) {
      if (err.code = 'ENOENT') this.answer = { status: 'ko', error: 'file config not fount !' };
      else throw err;
    }
  }

  // map json config to osmosis config & generate converter config
  generateConfig(config) {
    let converts = [];

    const deepLoop = (obj) => {
      for (let key in obj) {
        let result = obj[key];
        // if array generate osmosis config
        if (Array.isArray(result) && result[0]._find) {
          for (let i in result) {
            let set;
            result[i] = osmosis
              .find(result[i]._find)
              .set(set = (Object(result[i]._set) === result[i]._set) ? result[i]._set : { value: result[i]._set });
          }
        } else if (Object(result) === result) {
          deepLoop(result);
        }
      }
    };

    deepLoop(config.model._structure);
    return config;
  }

  // parse with osmosis based on conf generated
  parse() {
    return new Promise((resolve, reject) => {
      let results = {};
      osmosis
        .parse(this.source)
        // .find('#main-column')
        .set(this.config.model._structure)
        .data((data) => results = data)
        .done(() => resolve(results));
    });
  }
};
