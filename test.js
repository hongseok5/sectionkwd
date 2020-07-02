const e = require("express")

var data = {
  "aggregations" : {
    "ct1" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "건강",
          "doc_count" : 26,
          "ct2" : {
            "doc_count_error_upper_bound" : 0,
            "sum_other_doc_count" : 1,
            "buckets" : [
              {
                "key" : "신체",
                "doc_count" : 7
              },
              {
                "key" : "질병",
                "doc_count" : 5
              },
              {
                "key" : "병원",
                "doc_count" : 4
              },
              {
                "key" : "운동",
                "doc_count" : 2
              },
              {
                "key" : "치료",
                "doc_count" : 2
              },
              {
                "key" : "건강",
                "doc_count" : 1
              },
              {
                "key" : "건강수치",
                "doc_count" : 1
              },
              {
                "key" : "건강식품",
                "doc_count" : 1
              },
              {
                "key" : "다이어트",
                "doc_count" : 1
              },
              {
                "key" : "습관",
                "doc_count" : 1
              }
            ]
          }
        },
        {
          "key" : "인물",
          "doc_count" : 19,
          "ct2" : {
            "doc_count_error_upper_bound" : 0,
            "sum_other_doc_count" : 0,
            "buckets" : [
              {
                "key" : "가수",
                "doc_count" : 4
              },
              {
                "key" : "스포츠인",
                "doc_count" : 3
              },
              {
                "key" : "역사인물",
                "doc_count" : 3
              },
              {
                "key" : "코미디언",
                "doc_count" : 3
              },
              {
                "key" : "뮤지션",
                "doc_count" : 2
              },
              {
                "key" : "운동선수",
                "doc_count" : 1
              },
              {
                "key" : "의사",
                "doc_count" : 1
              },
              {
                "key" : "정치인",
                "doc_count" : 1
              },
              {
                "key" : "탤런트",
                "doc_count" : 1
              }
            ]
          }
        },
        {
          "key" : "음식",
          "doc_count" : 13,
          "ct2" : {
            "doc_count_error_upper_bound" : 0,
            "sum_other_doc_count" : 0,
            "buckets" : [
              {
                "key" : "요리",
                "doc_count" : 8
              },
              {
                "key" : "재료",
                "doc_count" : 4
              },
              {
                "key" : "음료",
                "doc_count" : 1
              }
            ]
          }
        },
        {
          "key" : "지역",
          "doc_count" : 5,
          "ct2" : {
            "doc_count_error_upper_bound" : 0,
            "sum_other_doc_count" : 0,
            "buckets" : [
              {
                "key" : "시설",
                "doc_count" : 2
              },
              {
                "key" : "도시",
                "doc_count" : 1
              },
              {
                "key" : "명소",
                "doc_count" : 1
              },
              {
                "key" : "지형",
                "doc_count" : 1
              }
            ]
          }
        },
        {
          "key" : "기타분류",
          "doc_count" : 3,
          "ct2" : {
            "doc_count_error_upper_bound" : 0,
            "sum_other_doc_count" : 0,
            "buckets" : [
              {
                "key" : "뉴스",
                "doc_count" : 1
              },
              {
                "key" : "사물",
                "doc_count" : 1
              },
              {
                "key" : "여행",
                "doc_count" : 1
              }
            ]
          }
        },
        {
          "key" : "컨텐츠",
          "doc_count" : 2,
          "ct2" : {
            "doc_count_error_upper_bound" : 0,
            "sum_other_doc_count" : 0,
            "buckets" : [
              {
                "key" : "음악",
                "doc_count" : 1
              },
              {
                "key" : "이벤트",
                "doc_count" : 1
              }
            ]
          }
        }
      ]
    }
  }
}
var treeData = []
for( c1 of data.aggregations.ct1.buckets){
  let el1 = {}
  el1.text = `${c1.key} (${c1.ct2.buckets.length})`
  el1.nodes = []
  for( c2 of c1.ct2.buckets ){
    let el2 = {}
    el2.text = `${c2.key} (${c2.doc_count})`
    el1.nodes.push(JSON.stringify(el2))
  }
  treeData.push(el1)
}

console.log(treeData)