var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect')
const index = "skt_dictionary"

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("typos");
  let body = {
    query : {
      match_all : {

      }
    },
    size : 10,
    aggs : {
      name : {
        terms : {
          field : "category1.keyword"
        }
      }
    }
  }


  esclient.search({ index , body }).then(function(resp){
    let data = {}
    data.count = resp.hits.total.value
    data.keywords = []
    data.category1s = []
    
    for( d of resp.hits.hits){
      // console.log(d)
      data.keywords.push( d._source)
    }

    for( b of resp.aggregations.name.buckets){
      // console.log(b)
      let el = {}
      el.count = b.doc_count
      el.category1 = b.key;
      data.category1s.push(el)
    }


    // console.log(data)
    res.render("typos", { data })
  }, function(err){
    console.log(err);
    res.render("typos", { message : "error"})
  });
});

module.exports = router;
