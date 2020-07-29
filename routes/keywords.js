var express = require('express');
var router = express.Router();
var esclient = require('../common/esconnect');
var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
const formidable = require('formidable')
var upload = multer({ dest: 'uploads/' });
var XLSX = require('xlsx');
//var parceXlsx = require('excel');
//import parseXlsx from 'excel';
const fs = require('fs');
const index = "skt_dictionary";
const util = require('../common/util');

router.get('/', function(req, res, next) {
  console.log("keywords")
  // 테이블을 제외하고 좌측에 카테고리 트리만 그려줌. 
  let cate1 = req.query.category1;
  let cate2 = req.query.category2;
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
        // 카테고리 트리를 만들기 위한 데이터 구조
        el1.text = c1.key
        el1.nodes = []
        for( c2 of c1.ct2.buckets ){
          let el2 = {}
          //el2.text = `${c2.key} (${c2.doc_count})`
          el2.text = c2.key
          el1.nodes.push(el2)
        }
        console.log(el1)
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
  // console.log(util.checkSelectVal( req.query.synonymYn, "synonym", must_not))
  must_not = util.checkSelectVal( req.query.synonym, "synonyms", must_not)
  must_not = util.checkSelectVal( req.query.typo, "typos", must_not) // 필드명 바꾸기
  must_not = util.checkSelectVal( req.query.relative, "rekeywords" ,must_not) 
  console.log(JSON.stringify(must_not))
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
          { term :                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   {
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
        el.id = h._id
        keywords.push(el)
        //console.log(el)
      }
      // console.log(JSON.stringify(keywords))
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
// 후보키워드로 이동 
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
/*
router.post('/uploadForm', upload.single('file'),function(req, res, next) {
  console.log('uploaded' + req.file)
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  var wb = XLSX.readFile(`./excel_data/data.xlsx`)
  var ws = wb.Sheets["Sheet1"]
  fs.writeFile(`./excel_data/keywords${uniqueSuffix}.xlsx`, req.file, function(){
    var buf = fs.readFileSync(`./excel_data/keywords${uniqueSuffix}.xlsx`, 'binary')
    var wb = XLSX.read(buf, { type : "buffer"});
    var json_data = XLSX.utils.sheet_to_json(wb)
  })
})
*/
router.post('/uploadForm',function(req, res, next) {
  // using formidable
  var form = new formidable.IncomingForm();
  form.parse( req, function(err, fields, files){
    if(err){
      res.send(500).send("error");
    }
    if(files.file.size == 0){
      // 파일이 Zero size 일 때 
      console.log("no file")
    } else {
      var f = files[Object.keys(files)[0]]
      var workbook = XLSX.readFile(f.path)
      console.log(XLSX.utils.sheet_to_json(workbook.Sheets['data']))
  
    }

  });

})
module.exports = router;
