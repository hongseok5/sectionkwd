var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
const index = "skt_nr_keywords"
const util = require('../common/util');

/* 페이지로드 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 테이블 조회 - 이 페이지는 updateWords와 화면형태, 인덱스가 똑같다. 화면에 표시되는 데이터에 except_yn값이 Y인 데이터만 가져온다.
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

module.exports = router;
