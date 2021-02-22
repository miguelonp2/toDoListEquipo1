const crypto = require("crypto");
const SECRET = "pablohacesecret";

function hashString(string, secret = SECRET) {
    const hashedString = crypto.createHmac("sha256", secret).update(string).digest("hex");
    return hashedString;
}

function saltPepperPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    let hash = hashString(hashString(password), salt);
    return { password: hash, salt };
}

function verifyPassword(password, originalPassword) {
    const hashedPassword = saltPepperPassword(password, originalPassword.salt);
    return hashedPassword.password === originalPassword.password;
}

module.exports = {
    hashString,
    saltPepperPassword,
    verifyPassword
}