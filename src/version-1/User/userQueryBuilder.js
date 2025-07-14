import _queryHelper from "../../db/db-runner.js";

export default 
{
    userGetbyId : async (req) =>
    {
        const {id} = req.customer_token_details;
        return await _queryHelper.selectS(`SELECT * FROM user WHERE id = ? AND status = ?`,[id, 1]);
       // return await _queryHelper.selectS('post',{is_like:2});
    },

    userEditprofile : async (id, _query, prms, num) =>
    {
        if(num == 1)
        {
            return await _queryHelper.query(_query, prms);
        }
        else if (num == 2)
        {
            return await _queryHelper.selectS(`SELECT * FROM user WHERE id = ?`,[id]);
        }
    },

    userAddContact : async (req) =>
    {
        const {id} = req.customer_token_details;
        const {name, email, description} = req.body;
        //let query = 
        //let prms = [id, contact];
        return await _queryHelper.insert(`INSERT INTO contact_us (user_id, name, email, description, status)
        VALUES (?, ?, ?, ?, ?)`,[id, name, email, description, 1]);
    },
}