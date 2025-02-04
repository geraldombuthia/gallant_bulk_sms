require("dotenv").config();
const serviceID = "GBSMS";
/**
 * Function to generate User account names to allow for offline Mpesa payments
 * @param {*} serviceID 
 * @param {*} userId 
 * @returns String
 * //@TODO introduce a hashing algorithm to hide user ids or use of them
 */

function accountRefGen() {
    return process.env.ACCOUNT_REF;
}

function getUserIdFromRef(accountRef) {
    return {
        serviceID: accountRef.substring(0, 5),
        userId: accountRef.substring(5, ) 
    };
}

module.exports = {accountRefGen, getUserIdFromRef, serviceID};