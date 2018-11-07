[![Mail](https://badges.weareopensource.me/badge/Contact-By%20Mail-3498db.svg?style=flat-square)](mailto:pierrebrisorgueil@me.com?subject=Contact%20node%20osmosis%20wrapper) [![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)

# Presentation

The purpose was to test Osmosis node web scraper.

For this, i made a simple conf wrapper of Osmosis in order to realize Web scrapping of a page only with a json conf file.

# Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js (8.x) - [Download & Install Node.js](https://nodejs.org/en/download/)

# Installation

It's straight forward

```bash
$ npm i
```

# Run Examples

- Run `npm start`, you will see the result of example in console.
- Run `npm test`, you will see a more complex result of example in console on SNCF data.

# Run your own config

- With Env Var : `WRAP_CONF='./config/sncf.json' WRAP_HTML='./sample/sncf.html' WRAP_ENCODE='utf8' node index.js`
- Or you can import libs in your projects

```
const path = require('path');
const Parser = require(path.resolve('./lib/parser.js'));

let p = new Parser('./config/example.json', './sample/example.html', 'utf8');
p.go();
```

# Explication

The json conf file contain :

- the structure (destination vs source in html)
- the types (in order to convert data format)

something like this :

```
{
  "model": {
    "_structure": {
      "article": ".title",
      "comments": [{
        "_find": ".comment",
        "_set": {
          "author": ".author",
          "message": ".message",
          "date": ".date"
        }
      }]
    }
    "_types": [{
      "_data": "array",
      "_type": "timestamp",
      "_path": "comments",
      "_key": "date"
    }]
  }
}

```

Based on `config.model._structure` we generate Osmosis configuration :

```
{
  "article": ".title",
  "comments": [
    osmosis
    .find('.comment')
    .set({
      "author": ".author",
      "message": ".message",
      "date": ".date"
    })
  ]
}
```

After this we convert type of data based on `config.model._types`

for :

```
<html>

<body>
  <h1 class="title">homePod Available in France</h1>
  <div id="comments">
    <div class="comment">
      <h3 class="author">Quentin</h3>
      <p class="message">test 3</p>
      <i class="date">03/14/2018</i>
    </div>
    <div class="comment">
      <h3 class="author">Thomas</h3>
      <p class="message">test 2</p>
      <i class="date">03/13/2018</i>
    </div>
    <div class="comment">
      <h3 class="author">David</h3>
      <p class="message">test 1</p>
      <i class="date">03/12/2018</i>
    </div>
  </div>
</body>

</html>
```

the result will be :
```
{
  "status": "ok",
  "result": {
    "article": "homePod Available in France",
    "comments": [
      {
        "author": "Quentin",
        "message": "test 3",
        "date": null
      },
      {
        "author": "Thomas",
        "message": "test 2",
        "date": 1520895600000
      },
      {
        "author": "David",
        "message": "test 1",
        "date": 1520809200000
      }
    ]
  }
}
```
# License

[![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)
