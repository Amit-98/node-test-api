import _queryBuilder from "./userQueryBuilder.js";
import _commonMethods from "../../common/commonMethods.js";
import _queryHelper from "../../db/db-runner.js";
//import _apiParams from "./authApiParams.js";
const fileName = "userController.js";

let userEdit = async (req, res, next) => 
{
    try
    {
        const {id, username, dob} = req.body;
       
        let query = `UPDATE user SET `;
        let prms = [];
        if(Object.hasOwn(req.body, "username"))
        {
            query += `username = ?,`;
            prms.push(username);
        }

        if(Object.hasOwn(req.body, "dob"))
        {
            query += `dob = ?,`;
            prms.push(dob);
        }

        if(req.files && Object.hasOwn(req.files, "profile_img"))
        {
            let profileImagePath = await _commonMethods.uploadFile(req.files.profile_img, "user/profile_img");
            if(!profileImagePath)
            {
                res.s = 0;
                res.m = "File upload failed";
                res.r = {};
                return res.sendResult();
            }
            query += `profile_img = ?,`;
            prms.push(profileImagePath);
        }

        if(prms.length> 0)
        {
            query = query.slice(0, -1);
            query += `WHERE id = ${id}`;

            let result = await _queryBuilder.userEditprofile(id,query,prms,1);
            if(result.affectedRows <= 0)
            {
                res.s = 0;
                res.m = "Something went wrong";
                res.r = {};
                return res.sendResult();
            }
            else
            {
                res.s = 1;
                res.m = "Success";
                res.r = await _queryBuilder.userEditprofile(id,query,prms,2);
                return res.sendResult();
            }
        }
        else
        {
            res.s = 0;
            res.m = "Params can't be less than 0";
            res.r = {};
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,userEdit.name,err.message,req);
        return next(new Error(err));
    }
};

let userGetById = async (req, res, next) =>{
    try
    {
        let result = await _queryBuilder.userGetbyId(req);
        if(result) 
        {
            res.s = 1;
            res.m = "Success";
            res.r = result;
            return res.sendResult();
        }
        else
        {
            res.s = 1;
            res.m = "Record not found";
            res.r = {};
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,userGetById.name,err.message,req);
        return next(new Error(err));
    }
}

export default
{
    userEdit,
    userGetById
}