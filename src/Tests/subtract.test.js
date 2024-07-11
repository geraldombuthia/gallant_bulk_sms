const subtract = require("../subtract");

test("Subtracts b from a", () => {
    expect(subtract(1, 2)).toBe(-1);
});