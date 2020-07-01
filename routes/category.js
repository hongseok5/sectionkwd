var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect')
const index = "skt_dictionary"


// 페이지 호출
router.get('/', function(req, res, next) {
  console.log("category");
  let body = {
    query : {
      match_all : {

      }
    },
    size : 10,
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
    let data1 = {}
    data1.cate1s = []

    for( c1 of resp.aggregations.cate1.buckets){
      // console.log(b)
      let el = {}
      el.count = c1.doc_count
      el.category1 = c1.key;
      data1.cate1s.push(el)
    }

    res.render("category", { data1 })
  }, function(err){
    console.log(err);
    res.render("category", { message : "error"})
  });

});


// * 테이블 조회
router.get('/getTableData', function(req, res, next) { 

  console.log("cate1 : ")
  var query;
  let category1 = req.query.cate1
  let category2 = req.query.cate2
  if( category1 === undefined && category2 === undefined){
    query = {
      match_all : {}
    }
  } else if ( category1 !== undefined && category2 === undefined ) {
    query = {
      term : { category1 : req.query.cate1 }
    }
  } else {
    query = {
      query_string : { 
        default_field : req.query.cate2 
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

  // * 카테고리 입력
router.post('/insertData', function(req, res, next) { 
  console.log("insertData")
  var parray = []
  for( d of req.body){
    console.log(d)
    var document = {
      index : index,
      type : "_doc",
      // id : null,
      body : {
        doc : {
          category2 : d.cate2,
          category1 : "테스트",
          keyword : d.cate2          
        }
        // doc_as_upsert : true
      }
    }
    /*
    esclient.index(document).then(v => {
      console.log(JSON.stringify(v))
    }, err => {
      console.log(JSON.stringify(err))
    })
    */
    if(true){
      res.send("OK")
    } else {
      res.send("ERR")
    }
    // parray.push(esclient.update(document))

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
