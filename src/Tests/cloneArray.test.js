const cloneArray = require("../cloneArray");

test("Clones an Array", () => {
    expect(cloneArray([1,2,3])).toEqual([1,2,3]);
});