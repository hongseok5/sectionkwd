const elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
  host : "localhost:9200",
  log : 'trace',
  apiVersion : '6.8'
})

esclient.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 3000
    // undocumented params are appended to the query string

  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
});

module.exports = esclient;

