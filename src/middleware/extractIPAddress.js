const parseIpAddress = require("../utils/parseIpAddress.js");
/**
 * Extracts an IP address that is ipv6 mapped from req and attaches it to the request object
 * as an iPV4 address as ipAddress
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function extractIPAddress(req, res, next){
    const ip = req?.connection?.remoteAddress;
    const extract = parseIpAddress(ip);
    req.ipAddress = extract;
    // console.error(extract);
    next();
}

module.exports = extractIPAddress;