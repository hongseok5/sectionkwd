/*
const elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
  host : "localhost:9200",
  log : 'trace',
  apiVersion : '7.8'
})
*/

const { Client } = require('elasticsearch')
const esclient = new Client({ node: 'http://localhost:9200', apiVersion: '7.6', log: 'error' })

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

