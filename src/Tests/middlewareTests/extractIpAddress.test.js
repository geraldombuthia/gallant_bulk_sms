const extractIPAddress = require("../../middleware/extractIPAddress.js");

describe("Middleware tests", () => {
    test("Extract an Ipv4 address from an ipv6 mapped address", () => {
        const req = {
            connection: {
                remoteAddress: "::ffff:192.168.1.1"
            }
        };
        const res = {};
        const next = jest.fn();

        extractIPAddress(req, res, next);
        expect(req.ipAddress).toBe("192.168.1.1");
        expect(next).toHaveBeenCalled();
    });
    test("Extract an Ipv4 address from an ipv4 address", () => {
        const req = {
            connection: {
                remoteAddress: "192.168.1.1"
            }
        };
        const res = {};
        const next = jest.fn();

        extractIPAddress(req, res, next);
        expect(req.ipAddress).toBe("192.168.1.1");
        expect(next).toHaveBeenCalled();
    });
    test("Extract an Ipv4 address from an ipv4 address part two", () => {
        const req = {
            connection: {
                remoteAddress: "::1"
            }
        };
        const res = {};
        const next = jest.fn();

        extractIPAddress(req, res, next);
        expect(req.ipAddress).toBe("::1"); // Localhost address
        expect(next).toHaveBeenCalled();
    });
    test("on an IPV6 address", () => {
        const req = {
            connection: {
                // IPV6 Address should be retained
                remoteAddress: "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
            }
        };

        const res = {};
        const next = jest.fn();

        extractIPAddress(req, res, next);
        expect(req.ipAddress).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        expect(next).toHaveBeenCalled();
    });
});
