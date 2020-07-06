var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
const index = "skt_dictionary"
const util = require('../common/util');

router.get('/', function(req, res, next) {
  console.log("keywords")
  // 테이블을 제외하고 좌측에 카테고리 트리만 그려줌. 
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

// 카테고리페이지에서 키워드 수 컬럼 클릭으로 들어올 때 또는 키워드 페이지 트리 클릭일때 
router.get('/getTableData', function(req, res, next) {
  console.log("keywords : " + req.query.category1 + "|" + req.query.category2)
  let query;
  let must = []
  let must_not = []
  // let filter = []
  must_not = util.checkSelectVal( req.query.synonymYn, "synonym", must_not)
  must_not = util.checkSelectVal( req.query.typoYn, "antonym", must_not) // 필드명 바꾸기
  must_not = util.checkSelectVal( req.query.relativeYn, "relative_words1" ,must_not) 

  if(req.query.keyword !== undefined){
    let qs = {
      query_string : {
        fields : ["category2", "keyword"],
        query : req.query.keyword
      }
    }
    must.push(qs)    
  }

  if( util.isEmpty(req.query.category1)  && util.isEmpty(req.query.category2)){
    query = {
      bool : {
        must_not,
        must
      }
    }
  } else if( !util.isEmpty(req.query.category1) && util.isEmpty(req.query.category2) ){
    query = {
      bool : {
        must_not,
        must,
        filter : [
          { term : {
            category1 : req.query.category1
          }}
        ]
      }
    }
  } else if( !util.isEmpty(req.query.category1) && !util.isEmpty(req.query.category2)){
    query = {
      bool : {
        must_not,
        must,
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

router.get("/getPopupData", function(req, res, next){
  console.log("/getPopupData")

  let body = {
    query : {
      query_string : {
        fields : ["edt_txt_01", "edt_txt_02"],
        query : req.query.keyword
      }
    },
    highlight : {
      fields : {
        edt_txt_01 : { type : "plain"},
        edt_txt_02 : { type : "plain"}
      }
    },
    size : 5
  }
  esclient.search({index : "dm_section", body}).then( resp => {
    if(resp.error === undefined){
      let data = []
      for( h of resp.hits.hits){
        var text;
        if( h.highlight.edt_txt_01 !== undefined || h.highlight.edt_txt_02 !== undefined){
          text = ( h.highlight.edt_txt_01 || "" ) + ( h.highlight.edt_txt_02 || "" )
          data.push(text)
        }                        
      }
      res.status(200).send( data );
    } else {
      res.send(500).send( resp );
    }
  }, error => {
    console.log(JSON.stringify(error))
  })
})

module.exports = router;
