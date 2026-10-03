import _queryHelper from "../../db/db-runner.js";

export default 
{
    // using mongoDb insert the data in mongoDb collection (contactUs)
    contactUs : async (req) =>
    {
        const {name,email,mobile,company,message,subject} = req.body;
        return await _queryHelper.query('contactUs',
            {
                name:name,
                email:email,
                mobile:mobile,
                company:company,
                message:message,
                subject:subject,
                status:1
            }
        );
    },    
}