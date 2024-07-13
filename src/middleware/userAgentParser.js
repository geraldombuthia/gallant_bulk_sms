const UAParser = require("ua-parser-js");
/**
 * Parses for the user agent information from the request headers
 * and stores it into the request object as userAgent
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function userAgentParser(req, res, next) {
    const parser = new UAParser();
    const ua = req.headers?.["user-agent"];
    const result = parser.setUA(ua).getResult();

    req.userAgent = result;

    console.log(req.userAgent);
    next();
}

module.exports = userAgentParser;