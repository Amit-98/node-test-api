import jwt from 'jsonwebtoken';
import constant from '../common/constant.js';
const authMiddleware = (req, res, next) => 
{
    const jwt_code = constant.JWT_CODE;
    try
    {
        let auth = req.headers;
        if(auth.authorization)
        {
            let token= req.headers.authorization.split(' ')[1]
            jwt.verify(token,jwt_code, (err, decoded)=>
            {
                if(err)
                {
                    return next(new Error("Unauthorized_token"));
                }
                else
                {
                    req.customer_token_details=decoded;
                    next();
                }
            });
        }
        else
        {
            return next(new Error("Unauthorized_token"));
        }
        // if(!req.headers.apikey || req.headers.token)
        // {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        // else
        // {
        //     return next();
        // }
    }
    catch(err)
    {
        console.error('Error in authMiddleware:', err);
        res.status(500).json({ error: 'Internal Server Error'});
    }

}

export default authMiddleware;