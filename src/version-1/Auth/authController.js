//import _queryBuilder from "./authQueryBuilder.js";
import _commonMethods from "../../common/commonMethods.js";
import _queryHelper from "../../db/db-runner.js";
import {jwt} from "../../common/index.js";
//import _apiParams from "./authApiParams.js";
const fileName = "authController.js";

let authSignup = async (req, res, next) => 
{
    try
    {
        const {username, email, password } = req.body;
        let emailresult = await _queryHelper.selectS(`SELECT * FROM user WHERE email = ?`, [email]);
        //console.log("CHECK EMAIL:",emailresult);
        if(emailresult)
        {
            res.s = 1;
            res.m = "Email already exist";
            res.r = {};
            return res.sendResult();
        }
        else
        {
            const encPass = await _commonMethods.encPass(password);
            let instResult = await _queryHelper.insert(`INSERT INTO user (username, email, password,status) VALUES (?,?,?,?)`,
                [username, email, encPass, 1]
            );
            if(instResult.insertId <= 0)
            {
                res.s = 0;
                res.m = "Something went wrong";
                res.r = {};
                return res.sendResult();
            }
            else
            {
                let result = await _queryHelper.selectS(`SELECT * FROM user WHERE id = ?`, [instResult.insertId]);
                if(!result)
                {
                    res.s = 0;
                    res.m = "Something went wrong";
                    res.r = {};
                    return res.sendResult();
                }
                else
                {
                    let token = jwt.tokenCreate({id: result.id, email: result.email, username: result.username});
                    result.token = token;
                    res.s = 1;
                    res.m = "Successfully registered";
                    res.r = result;
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
        const {email, password} = req.body;
        let result = await _queryHelper.selectS(`SELECT * FROM user WHERE email = ?`, [email]);
        if(result)
        {
            // check Password:
            const isPasswordValid = await _commonMethods.cmpPass(result.password, password);
            if(!isPasswordValid)
            {
                res.s = 0;
                res.m = "Invalid email or password";
                res.r = {};
                return res.sendResult();
            }
            else
            {
                let token = jwt.tokenCreate({id: result.id, email: result.email, username: result.username});
                result.token = token;
                res.s = 1;
                res.m = "Login successfully";
                res.r = result;
                return res.sendResult();
            }
        }
        else
        {
            res.s = 0;
            res.m = "Invalid email or password";
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

export default 
{
    authSignup,
    authLogin
}