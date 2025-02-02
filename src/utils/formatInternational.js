const { parsePhoneNumberWithError } = require("libphonenumber-js");
/**
 * 
 * @brief This function takes in a phone number and returns the formatted international phone number
 * the number is in the form of 254728000000
 * @param {*} num 
 * @returns 
 */

function formatToIntNumber(phoneNumber) {
    const validateNumber = parsePhoneNumberWithError(String(phoneNumber), {
        defaultCountry: "KE"
    });
    
    if (!validateNumber.isValid()) {
        throw new Error("Invalid phone number format");
    }

    const formatNumber = validateNumber.formatInternational()
        .replace(/^(\+)/, "")
        .replace(/\s+/g, "");

    return formatNumber;
}

module.exports = {
    formatToIntNumber
};