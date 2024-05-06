const jwt = require("jsonwebtoken");

//verify token
module.exports = verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            status: 0,
            message: "Unauthorized access"
        });
    }

    // bearer token
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decode) {
        if (error) {
            console.log(error)
            return res.status(403).json({
                status: 0,
                message: "Invalid token"
            })
        }
        req.decode = decode;
        next();
    })
}