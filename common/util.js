const e = require("express")

let util = {
    isEmpty : v => {
        if( v == '' || v === undefined || v == null){
            return true
        } else {
            return false
        }
    },
    checkSelectVal : (v, fname ,a) => {
        if(Array.isArray(a) && v !== undefined ){
            if(v === "A"){
                // 전체일 경우 들어온 array에 아무것도 넣지 않고 리턴
                return a
            } else if(v === "Y"){
                // 값이 있는 필드만 조회하려고 할 경우
                let obj = { term : {fname : "" }}                
                return a.push(obj)
            } else if(v === "N"){
                // 동의어가 존재 하지 않는 필드의 경우 - must not 에 넣는다. 수집시에 없는 건 
                let obj = { exists : {field : fname }}  
                return a.push(obj)    
            } else {
                // 예외처리
                console.log("Function checkSelect Vale Exception1!")
                return a
            }
        } else {
            console.log("Function checkSelect Vale Exception2!")
            return a
        }
    }
}

module.exports = util