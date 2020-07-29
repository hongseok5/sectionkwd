var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
var util = require('../common/util');
const e = require('express');
const index = "skt_dictionary"


// 페이지 호출
router.get('/', function(req, res, next) {

  console.log("category");
  res.render("category", {})
});

// 대분류
router.get('/getCategoryData', function(req,res) {

  let body = {
    query : { match_all : { } },
    size : 0,
    aggs : {
      cate1 : {
        terms : {
          field : "category1.keyword"
        },
        aggs : {
          cate2 : {
            terms : {
              field : "category2.keyword"
            }
          }
        }
      }
    }
  }

  esclient.search({ index , body }).then( function(resp){

    let cateTree = []
    for( c1 of resp.aggregations.cate1.buckets){
      let el = {}
      //el.text = `${c1.key} (${c1.doc_count})`;
      el.cate1 = c1.key
      el.initValue1 = c1.key
      el.initValue2 = c2.key
      cateTree.push(el)
    }

    res.status(200).send( cateTree );
  }, function(err){
    console.log(err);
    res.render("category", { message : "error"})
  });

})


// * 테이블 조회 (중분류)
router.get('/getTableData', function(req, res, next) { 

  console.log("cate1 : " + req.query.cate1 + "cate2 : " + req.query.keyword)
  var query;
  let category1 = req.query.cate1
  let category2 = req.query.keyword

  if( util.isEmpty(category1) && util.isEmpty(category2)){
    query = {
      match_all : {}
    }
  } else if ( !util.isEmpty(category1) && util.isEmpty(category2) ) {
    query = {
      term : { category1 }
    }
  } else if ( util.isEmpty(category1) && !util.isEmpty(category2) ){
    query = {
      match : { category2  } 
    }
  } else {
    query = {
      bool : {
        filter : [ { term : { category1 }} ],
        must : [ { match : { category2  }} ]
      }
    }
  }

  let body = {
    query : query ,
    size : req.body.size,
    aggs : {
      cate1 : {
        terms : {
          field : "category1.keyword"
        },
        aggs : {
          cate2 : {
            terms : {
              field : "category2.keyword"
            }
          }
        }
      }
    }
  }

  esclient.search({ index , body }).then(function(resp){
    let data2 = {}
    data2.cate2s = []
    for( c1 of resp.aggregations.cate1.buckets){
      for( c2 of c1.cate2.buckets){
        let el = {}
        el.cate1 = c1.key
        el.cate2 = c2.key;
        el.count = c2.doc_count;
        console.log(c2)
        data2.cate2s.push(el);
      }
    }
    res.status(200).send( data2.cate2s );
  }, function(err){
    console.log(err);
    res.render("category", { message : "error"})
  });  
});

// * 카테고리 입력/수정 컬럼값을 통해 인서트와 UPDATE를 구분해 같이 처리한다.
router.post('/insertData', function(req, res, next) { 
  console.log("insertData")
  var parray = []
  let insertDocs = req.body.filter( v => {
    return v.isNew == "Y"
  })

  let updateDocs = req.body.filter( v => {
    return v.isEdited == "Y"
  })  
  // 인서트 처리
  for( d of insertDocs){
    console.log(d)
    var document = {
      index : index,
      type : "_doc",
      body : {    
        category2 : d.cate2,
        category1 : d.cate1,
        keyword : d.keyword        
      }
    }
    
    esclient.index(document).then(v => {
      console.log(JSON.stringify(v))
      res.send("OK")
    }, err => {
      console.log(JSON.stringify(err))
      res.send("ERR")
    })

  }

  for( d of updateDocs){
    var document = {
      index : index,
      type : '_doc',
      body : {
        query : {
          term : {
            category1 : d.initValue
          }
        },
        script : {
          lang : "painless",
          source : `ctx._source['category1'] = '${d.cate1}'`
        }
      }
    }

    esclient.updateByQuery(document).then( v => {
      console.log(JSON.stringify(v))
      res.send("OK")
    }, err => {
      console.log(JSON.stringify(err))
      res.send("ERR")
    })
  }
  /*
  Promise.all(parray).then(vls => {
    for( v in vls ){
      console.log(JSON.stringify(v))
    }
    res.send("OK")
  }, err => {
    res.send("ERROR")
  })
  */
})

module.exports = router;
