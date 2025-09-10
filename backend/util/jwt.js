const jwt = require('jsonwebtoken');
const secretKey = "my-secret-key";
async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        res.status(400).json({content: null, error: "Forbidden Access"});
        return;
    }

    const user = await decodeJWT(token);
    if(!user) {
        res.status(400).json({content: null, error: "Invalid Token"});
    }
    else {
        res.locals.user = user;
        next();
    }

}

async function decodeJWT(token){
    try{
        const user = await jwt.verify(token, secretKey);
        return user;
    }catch(error){
        logger.error(err);
        return null;
    }
}

module.exports = {
    authenticateToken
}
