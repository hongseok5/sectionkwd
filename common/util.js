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
        console.log(fname)
        if(Array.isArray(a) ){
            if(v === "A"){
                // 전체일 경우 들어온 array에 아무것도 넣지 않고 리턴
                return a
            } else if(v === "Y"){
                let obj;
                if(fname === "synonym"){
                    obj = { term : { "synonym.keyword" : "" }}    
                } else if(fname === "typo"){
                    obj = { term : { "antonym.keyword" : "" }} 
                } else if(fname === "relative") {
                    obj = { term : { "relative_words1.keyword" : "" }}
                } else {
                    console.log("Exception!!")
                    //let obj = { term : { "synonym.keyword" : "" }}  
                    //a.push(obj)
                    return a  
                }              
                a.push(obj)           
                return a
            } else if(v === "N"){
                // 동의어가 존재 하지 않는 필드의 경우 - must not 에 넣는다. 수집시에 없는 건 
                let obj = { exists : { field : fname + ".keyword" }}  
                a.push(obj)    
                return a
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