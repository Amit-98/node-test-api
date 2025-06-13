const authMiddleware = (req, res, next) => 
{
    try
    {
        if(!req.headers.apikey || req.headers.token)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        else
        {
            return next();
        }
    }
    catch(err)
    {
        console.error('Error in authMiddleware:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

export default authMiddleware;