var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
const index = "skt_ckeywords"
const util = require('../common/util');

/* GET users listing. */
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

router.post('/moveToExcept', function(req, res, next) {
  console.log('/moveToExcept')
  res.render()
});

module.exports = router;
