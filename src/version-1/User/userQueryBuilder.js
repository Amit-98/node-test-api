import _queryHelper from "../../db/db-runner.js";

export default 
{
    userGetbyId : async (req) =>
    {
        const {id} = req.customer_token_details;
        return await _queryHelper.selectS(`SELECT * FROM user WHERE id = ? AND status = ?`,[id, 1]);
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
    }
}