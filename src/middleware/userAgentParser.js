import { UAParser } from "ua-parser-js";

export function userAgentParser() {
    return function(req, res, next) {
    
        const parser = new UAParser();
        const ua = req.headers["user-agent"];
        const result = parser.setUA(ua).getResult();

        req.userAgent = result;

        console.log(result);
        next();
    };
}