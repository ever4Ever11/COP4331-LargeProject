require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.createToken = function (fn, ln, id) {
    return _createToken(fn, ln, id);
};

function _createToken(fn, ln, id) {
    try {
        const user = { userId: id, firstName: fn, lastName: ln };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "2h",
        });
        return { accessToken };
    } catch (e) {
        return { error: e.message };
    }
}

exports.isExpired = function (token) {
    var isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err, verifiedJwt) => {
            if (err) {
                return true;
            }
            else {
                return false;
            }
        });
    return isError;
}
exports.refresh = function (token) {
    var ud = jwt.decode(token, { complete: true });
    var userId = ud.payload.id;
    var firstName = ud.payload.firstName;
    var lastName = ud.payload.lastName;
    return _createToken(firstName, lastName, userId);
}
