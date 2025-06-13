let resError=(error,customMsg)=>{
    return {customMsg:customMsg,message:error.details.map(obj=>{
        let key=obj.path[0]
       return {[key]:obj.message.replace(/"/g , '')}
   })}
}

export {
    resError
}