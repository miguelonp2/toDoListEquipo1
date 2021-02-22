const excludedPaths = ["/user POST", "/login POST"];

const SECRET = "pablohacesecret";
const JWT = require("jwt-simple");

function checkPath(pathname, method) {
    const endpoint = `${pathname} ${method}`;
    return excludedPaths.includes(endpoint);
}

function auth(req, res, next) {
    if (!checkPath(req.path, req.method)) {
        const { jwt } = req.cookies;
        let payload;
        try {
            if (jwt) {
                payload = JWT.decode(jwt, SECRET);
                if (payload) {
                    req.user = payload;
                    next();
                } else {
                    throw "No valid JWT";
                }
            } else {
                throw "No payload";
            }
        } catch (e) {
            res.status(403).send({ error: "You must be logged in" });
        }
    } else {
        next();
    }
}

module.exports = {
    auth,
    checkPath
}