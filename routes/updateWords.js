var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
const index = "skt_ckeywords"
const util = require('../common/util');

/* 페이지로드 */
router.get('/', function(req, res, next) {
  console.log("updateWords")
  let body = {
    query : { match_all : {}},
    size : 15
  }
  esclient.search({ index, body }).then(resp => {
    //console.log(JSON.stringify(resp))
    keywords = []
    for( h of resp.hits.hits){
      let obj = {}
      obj.id = h._id
      obj.ckeyword = h._source.ckeyword
      obj.ext_count = h._source.ext_count
      obj.except_yn = h._source.except_yn
      obj.first_ext_date = h._source.first_ext_date
      obj.last_ext_date = h._source.last_ext_date
      keywords.push(obj)
      console.log(JSON.stringify(obj))
    }
    res.render("updateWords", { keywords })
  }, err => {
    console.log(JSON.stringify(err))    
    res.render("updateWords")
  })
});

// 테이블 조회
router.get('/getTableData', function(req, res, next) {
  console.log('/getTableData ' + req.query.from )
  let body = {
    size : 15,
    from : req.query.from
  }
  esclient.search({ index, body }).then( resp => {
    //console.log(JSON.stringify(resp))
    keywords = []
    for( h of resp.hits.hits){
      let obj = {}
      obj.id = h._id
      obj.ckeyword = h._source.ckeyword
      obj.ext_count = h._source.ext_count
      obj.except_yn = h._source.except_yn
      obj.first_ext_date = h._source.first_ext_date
      obj.last_ext_date = h._source.last_ext_date
      keywords.push(obj)
      console.log(JSON.stringify(obj))
    }
    res.json({ result : "sucess" , data : keywords })
  }, err => {
    console.log(JSON.stringify(err))
  })
  
});

// 선택한 단어를 키워드사전으로 이동
router.post('/registerDict', function(req, res, next) {
  console.log('/registerDict' + JSON.stringify(req.body.ckeyword))
  
  let body = {
    query : {
      term : {
        ckeyword : req.body.ckeyword
      }
    }
  }

  esclient.search({ index, body }).then(resp => {
    if(Number(resp.hits.total.value) === 0){
      console.log("insert")
      esclient.index()
    } else {
      console.log("exist")
    }
    res.send("OK")
  }, err => {
    console.log(err)
    res.send("ERROR")
  })
  
});

// 선택한 단어를 제외키워드로 이동
router.post('/moveToExcept', function(req, res, next) {
  console.log('/moveToExcept')
  res.render()
});

// 키워드 클릭시 해당 화면에서 팝업형태로 하이라이트해서 보여줘야함
router.get("/getPopupData", function(req, res, next){
  console.log("/getPopupData")

  let body = {
    query : {
      query_string : {
        fields : ["txt1", "txt2"],
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
  esclient.search({index : "skt_sections", body}).then( resp => {
    if(resp.error === undefined){
      let data = []
      for( h of resp.hits.hits){
        var text;
        // 필드명 바꿔야함
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
