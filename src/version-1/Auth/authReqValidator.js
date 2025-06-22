import Joi from "joi";
import { resError } from "../../common/joi-validator/index.js";
//import _apiparam from "./authApiParams.js";

export default 
{
    authSignup : (req, res, next) => 
    {
        const schema = Joi.object
        ({
            ['username']: Joi.string().strict().trim().min(1).max(100).required(),

            ['email']: Joi.string().strict().trim().min(1).max(200).required(),
            
            ['password']: Joi.string().strict().trim().min(1).required(),
            
            //[_apiparam.SIGNUP_PARAM.authtype]: Joi.string().strict().trim().min(1).required(),

            ['role']: Joi.string().strict().trim().min(1).allow("1","2","3","4").required(),
        });
        let body = req.body; 
        let { error } = schema.validate(body);
        if (error)
        {
            next(resError(error, "Invalid data in request json."));
        } 
        else
        {
            next();
        }
    },

    authLogin : (req, res, next) => 
    {
        const schema = Joi.object
        ({
            ['email']: Joi.string().strict().trim().min(1).max(100).required(),

            ['password']: Joi.string().strict().trim().min(1).max(200).required(),
        });
        let body = req.body;
        let { error } = schema.validate(body);
        if (error) 
        {
            next(resError(error, "Invalid data in request json."));
        }
        else
        {
            next();
        }
    },
}