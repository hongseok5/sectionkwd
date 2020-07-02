var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
const { query } = require('express');
const e = require('express');
const index = "skt_dictionary"
const util = require('../common/util');

router.get('/', function(req, res, next) {
  console.log("keywords")
  // 카테고리 페이지에서 클릭으로 들어왔을때 cate2 파라미터
  let cate1 = req.query.category1;
  let cate2 = req.query.category2;
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

  esclient.search({ index, body }).then(resp => {
    let cateTree = []

    if(Array.isArray(resp.aggregations.ct1.buckets) ){

      for(c1 of resp.aggregations.ct1.buckets){
        let el1 = {}
        el1.text = `${c1.key} (${c1.ct2.buckets.length})`
        //el1.text = c1.key
        el1.nodes = []
        for( c2 of c1.ct2.buckets ){
          let el2 = {}
          el2.text = `${c2.key} (${c2.doc_count})`
          //el2.text = c2.key
          el1.nodes.push(el2)
        }
        cateTree.push(el1)
      }
      res.render("keywords", { cateTree , cate2, cate1 })
    }
    
  }, err => {
    console.log(JSON.stringify(err))
  })
});

// 키워드페이지에서 검색으로 요청할 때 
/*
router.post('/getTableData', function(req, res, next) {
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
*/
// 카테고리페이지에서 키워드 수 컬럼 클릭으로 들어올 때 또는 키워드 페이지 트리 클릭일때 
router.get('/getTableData', function(req, res, next) {
  console.log("keywords : " + req.query.category1 + "|" + req.query.category2)
  let query;
  console.log(util.isEmpty(req.query.category1) + " " + util.isEmpty(req.query.category2))
  if( util.isEmpty(req.query.category1)  && util.isEmpty(req.query.category2)){
    query = { match_all : {}}
  } else if( !util.isEmpty(req.query.category1) && util.isEmpty(req.query.category2) ){
    query = {
      term : {
        category1 : req.query.category1
      }
    }
  } else if( !util.isEmpty(req.query.category1) && !util.isEmpty(req.query.category2)){
    query = {
      bool : {
        filter : [
          { term : {
            category1 : req.query.category1
          }},
          { term : {
            category2 : req.query.category2
          }}
        ]
      }
    }
  } else {
    console.log("Exception!")
  }
  console.log("Debug")
  let body = {
    query : query,
    size : 10000
  }
  console.log(body)
  console.log("Debug")
  esclient.search({ index, body }).then(resp => {
    console.log("Test es ")
    if(resp.error === undefined){
      let keywords = []
      for( h of resp.hits.hits){
        let el = {}
        el = h._source
        el.id = h.id
        /*
        el.id = h._id
        el.category1 = h._source.category1
        el.category2 = h._source.category2
        el.keywords = h._source.
        */
        keywords.push(el)
      }
      res.status(200).send( keywords );
    } else {
      console.log("Error")
      res.status(500).send([]);
    }

  }, err => {
    console.log("Error")
    console.log(err)
  })
})

module.exports = router;
