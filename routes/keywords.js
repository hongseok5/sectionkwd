var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
const e = require('express');
const index = "skt_dictionary"

router.get('/', function(req, res, next) {
  console.log("keywords")
  let cate2 = req.query.cate2;
  let query;

  let body = {
    query : {
      match_all : { }
    },
    "aggs" : {
      "ct1" : {
        "terms" : {
          "field": "category1.keyword"
        },
        "aggs" : {
          "ct2" : {
            "terms" : {
              "field" : "category2.keyword"
            }
          }
        }
      }
    },
    size : 0
  }


  // console.log(category2)
  esclient.search({ index, body }).then(resp => {
    let dataC1 = []
    /*
    for( c1 of resp.aggregations.cate1.buckets ){
      let el = {}
      el.cate1 = c1.key
      el.count = c1.doc_count
      el.cate2s = []
      for( c2 of c1.buckets){
        let el2 = {}
        el2.cate2 = c2.key
        el2.count = c2.doc_count
        el.cate2s.push(el2)
      }
    }
    */
    if(Array.isArray(resp.aggregations.ct1.buckets) ){
      res.render("keywords", { ctList : resp.aggregations.ct1.buckets, cate2 })
    }
    
  }, err => {
    console.log(JSON.stringify(err))
  })
});

// 카테고리페이지에서 키워드 수 컬럼 클릭으로 들어올 때
router.get('/getTableData', function(req, res, next) {
  console.log(typeof req.query)
  let query;
  let size = req.query.size || 20;
  if( req.query.cate2 !== undefined){
    query = {
      term : {
        "category2.keyword" : req.query.cate2
      }
    }
  } else {
    query = { match_all : {}}
  }

  let body = {
    size : 1000, 
    query : query
  }
  let keywords = []
  esclient.search({ index, body }).then( resp => {
    for( h of resp.hits.hits){
      keywords.push( h._source )
    }
    res.status(200).send(keywords);
  }, err => {
    console.log(JSON.stringify(err))
  })  
})

// 키워드페이지에서 검색으로 요청할 때 
router.post('/getTableData', function(req, res, next) {
  console.log("keywords : ")

  res.json(data)
})

module.exports = router;
