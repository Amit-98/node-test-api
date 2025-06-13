//import _queryBuilder from "./authQueryBuilder.js";
import _commonMethods from "../../common/commonMethods.js";
import _queryHelper from "../../db/db-runner.js";
//import _apiParams from "./authApiParams.js";
const fileName = "authController.js";

let authSignup = async (req, res, next) => 
{
    try
    {
        let emailresult = await _queryHelper.query(`SELECT * FROM user WHERE email = ?`, [req.body.email]);
        console.log("CHECK EMAIL:",emailresult.length);
        if(emailresult.length > 0)
        {
            res.s = 1;
            res.m = "Email already exist";
            res.r = {};
            return res.sendResult();
        }
        else
        {
            let instResult = await _queryHelper.query(`INSERT INTO user (username, email, password) VALUES (?,?,?)`,
                [req.body.username, req.body.email,req.body.password]);
            
            if(instResult.insertId <= 0)
            {
                res.s = 0;
                res.m = "Something went wrong";
                res.r = {};
                return res.sendResult();
            }
            else
            {
                let result = await _queryHelper.query(`SELECT * FROM user WHERE id = ?`, [instResult.insertId]);
                if(result.length <= 0)
                {
                    res.s = 0;
                    res.m = "Something went wrong";
                    res.r = {};
                    return res.sendResult();
                }
                else
                {
                    res.s = 1;
                    res.m = "Successfully registered";
                    res.r = result[0];
                    return res.sendResult();
                }
            }
            
        }
    }
    catch (err)
    {
        _commonMethods.saveErrorLog(fileName,authSignup.name,err.message,req);
        return next(new Error(err));
    }
};

let authLogin = async (req, res, next) => 
{
    try
    {
        const {password} = req.body;
        const result = await _queryBuilder.authCheckEmail(req);
        if(result)
        {
            const passCheck = _commonMethods.check_password(result.password, password);
            if(passCheck)
            {
                req.body.userId = result.id;
                const resultAuthToken = await _queryBuilder.authTokenSuccess(req);
                const resultRole = await _queryBuilder.authRoleSuccess(req);
                if(resultAuthToken && resultRole)
                {
                    result.userAuthToken = resultAuthToken;
                    result.userRole = resultRole;
                    res.s = 1;
                    res.m = "Login successfully";
                    res.r = result;
                    return res.sendResult();
                }
                else
                {
                    res.s = 0;
                    res.m = "Please enter valid crendential";
                    res.r = {};
                    return res.sendResult();
                }
            }
            else
            {
                res.s = 0;
                res.m = "Please enter valid crendential";
                res.r = {};
                return res.sendResult();
            }
        }
        else
        {
            res.s = 0;
            res.m = "Please enter valid crendential";
            res.r = {};
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,authLogin.name,err.message,req);
        return next(new Error(err));
    }
};

export default {
    authSignup,
    authLogin
}