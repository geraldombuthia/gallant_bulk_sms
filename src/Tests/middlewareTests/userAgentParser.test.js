const userAgentParser = require("../../middleware/userAgentParser");

describe("user agent extraction test", () => {
    test("Extract user agent information from the request headers", () => {
        const req = {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
            }
        }
        const res = {};
        const next = jest.fn();

        userAgentParser(req, res, next);
        expect(req.userAgent).toEqual(
            {
                ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                browser: { name: 'Chrome', version: '58.0.3029.110', major: '58' },
                engine: { name: 'Blink', version: '58.0.3029.110' },
                os: { name: 'Windows', version: '10' },
                device: { vendor: undefined, model: undefined, type: undefined },
                cpu: { architecture: 'amd64' }
              });
        expect(next).toHaveBeenCalled();
    });
    test("Extract user agent information from the request headers", () => {
        const req = {
            headers: {
                "user-agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
            }
        }
        const res = {};
        const next = jest.fn();

        userAgentParser(req, res, next);
        expect(req.userAgent).toEqual(
            {
                ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                browser: { name: 'Chrome', version: '126.0.0.0', major: '126' },
                engine: { name: 'Blink', version: '126.0.0.0' },
                os: { name: 'Linux', version: 'x86_64' },
                device: { vendor: undefined, model: undefined, type: undefined },
                cpu: { architecture: 'amd64' }
              });
        expect(next).toHaveBeenCalled();
    });
})