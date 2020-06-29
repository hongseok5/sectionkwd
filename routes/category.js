var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect')
const index = "skt_dictionary"

router.get('/', function(req, res, next) {
  console.log("category");
  let body = {
    query : {
      match_all : {

      }
    }
  }


  esclient.search({ index , body }).then(function(resp){
    let data = {}
    data.count = resp.hits.total.value
    data.datas = []
    for( d in resp.hits.hits){
      data.datas.push( d._source)
    }
    res.render("category", { data })
  }, function(err){
    console.log(err);
    res.render("category", { message : "error"})
  });

});



router.get('/data', function(req, res, next) {
  console.log("test")
  let data3 = []
  for(let i = 0; i < 1000; i++){
    data3.push(i)
  }


});

module.exports = router;
