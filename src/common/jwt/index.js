import jwt from 'jsonwebtoken';
import constant from "../../common/constant.js";
const jwt_code = constant.JWT_CODE;
const Api_key = constant.API_KEY;

let tokenCreate=(data)=>{
    return  jwt.sign(data, jwt_code, {
        expiresIn: 60 * 60 * 24 // expires time
    });
}

//When user logout...
let tokenExpire=(data)=>{
    const token = jwt.sign(data,jwt_code, {
        expiresIn: '1ms' // expires time
    })

    return jwt.verify(token,jwt_code, (err, decoded)=>{
        if(err)
        {
            return "LOGOUT";
        }
        else
        {
            return "LOGOUT_FAILED";
        }
    })
}

let tokenVerify=(req,res,next)=>{
    let auth = req.headers;
    if(auth.authorization)
    {
        let token= req.headers.authorization.split(' ')[1]
        jwt.verify(token,jwt_code, (err, decoded)=>{
            if(err)
            {
                return next(new Error("Unauthorized_token"));
            }
            //console.log("HELLO",decoded);
            req.customer_token_details=decoded
            next()
        })
    }
    else
    {
        return next(new Error("Unauthorized_token"));
    }
}

let verify_Apikey =(req, res, next)=>{
    let auth = req.headers['api-key'];
    //console.log("TEST:", auth);
    let key = Api_key;
    if(auth!=key || auth =="" || auth == null || auth == undefined)
    {
        return next(new Error("INVALID_KEY"));
    }
    else
    {
        next();
    }
} 

export default{
    tokenCreate,
    tokenVerify,
    tokenExpire,
    verify_Apikey
}