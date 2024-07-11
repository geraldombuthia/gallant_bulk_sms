const sum = require("../sum.js");

test("Adds two numbers", () => {
    expect(sum(1,2)).toBe(3);
});