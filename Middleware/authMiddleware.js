const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const token = req.header('Authorization');
    if(!token) return res.json({ error: 'Access denied' });

    try{
        if(typeof token !== undefined){
            const bearerToken = token.split(" ")[1];
            const decoded = jwt.verify(bearerToken, 'your_secret_key');
            req.userId = decoded.userId;
            next();
        }
        else{
            res.json({
                status: 'fail',
                message: 'Unauthorized!',
            });
        }
    }
    catch(err) {
        res.json({ err: 'Invalid token' });
    }
}

module.exports = verifyToken;