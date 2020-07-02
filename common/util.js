let util = {
    isEmpty : v => {
        if( v == '' || v === undefined || v == null){
            return true
        } else {
            return false
        }
    }
}

module.exports = util