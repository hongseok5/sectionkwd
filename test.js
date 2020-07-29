var levenshtein = require('levenshtein-edit-distance')
const kmeansEngine = require("kmeans-engine")
const clus
var texts = [
  '최수종의 좋은 캠프',
  '최수종의 좋은 캠프',
  '최수종의 은 캠',
  '최수종의 ��은 캠푸',
  '강남 V 이삼화',
  '강남 이삼',
  '강남 이삼화 |',
  '강남 이삼화',
  '최수좀 C 하희라',
  '수좀 하희라',
  '최수점 하희라',
  '최수종 하희라',
  '최수종 C 하희라',
  '잠신영 C 감경준',
  '잠신영 V 감경준',
  '잠신영 감경준' ,
  '한고은 신영수',
  '고은 신영수',
  '한고은 신영수',
  '고은 V 신영수',
  '한고은 C 신영수'
]

function makeMatrix(textArray){
  let array1 = []
  
  for(let i = 0; i < textArray.length; i++){
    let array2 = []
    for(let j = 0; j < textArray.length; j++){
      array2[j] = 0
    }
    //console.log(array2)
    array1.push(array2)
  }
  
  
  for(let i = 0; i < textArray.length ; i++){
    array2 = []
    array2[0] = 0
    for(let j = i + 1; j < textArray.length; j++){
      let distance = levenshtein(textArray[i], textArray[j])
      
      array1[i][j] = distance
      array1[j][i] = distance

    }
    console.log(array1)
  } 
  console.log('\n') 
  //console.log(array1)
  return array1;
}

function makeClusteringData( dmatrix ){
  var dataList = []
  for(let i = 0; i < dmatrix.length; i++){
    let obj = {}
    for(let j = 1; j < dmatrix[i].length; j++){
      let k = j + i;
      if( k < dmatrix[i].length){
        let id = "d" + k;
        obj[id] = dmatrix[i][k];
      } else {
        let id = "d" + Math.abs(dmatrix[i].length - k);
        if( obj.id === null || obj.id === undefined){
          obj[id] = dmatrix[i][Math.abs(dmatrix[i].length - k)]
        }
      }
    }
    dataList.push(obj)
  }
  return dataList
}

var disMatrix = makeMatrix(texts)
// console.log(disMatrix)
var nm1 = makeClusteringData(disMatrix)
console.log(nm1)

/*
console.log(nm1)

kmeansEngine.clusterize(nm1, { k : 5, maxIterations: 1, debug: false}, (err, res) => {
  // K 값 자동으로 군집화 할 수 있는지
  // 문장을 형태소분석하여 재구성하고 군집화
  console.log('----- Results -----');
  //console.log(`Iterations: ${res.iterations}`);
  console.log('Clusters: ');
  //console.log(res.clusters);
  for( i of res.clusters){
    console.log(i.vectorIds)
  }
})
//console.log(nm1)
*/

