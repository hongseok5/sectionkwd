var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect')
/* GET users listing. */
router.get('/', function(req, res, next) {
  let data = [

  ]
  res.render('keywords', { data });
});


router.post('/', function(req, res, next) {

  let data = {
    "code" : "10",
    "data" : [
      { keyword : "a1", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a2", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a3", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a4", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a1", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a2", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a3", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a4", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a1", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a2", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a3", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a4", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a1", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a2", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a3", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a4", synonyms : "b", relatedwds : "c", typos: "d"},
      { keyword : "a5", synonyms : "b", relatedwds : "c", typos: "d"}
    ]
  }

  res.json(data)
})

module.exports = router;
