const path = require('path');
const Parser = require(path.resolve('./lib/parser.js'));

let p = new Parser(process.env.WRAP_CONF || './config/example.json', process.env.WRAP_HTML || './sample/example.html', process.env.WRAP_ENCODE || 'utf8');
p.go();
