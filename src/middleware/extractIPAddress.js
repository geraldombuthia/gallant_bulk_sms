import { parseIpAddress } from "../utils/parseIpAddress.js";

export function extractIPAddress(req, res, next){
    const ip = req?.connection?.remoteAddress;
    const extract = parseIpAddress(ip);
    req.ipAddress = ip;
    console.log(extract);
    next();
}