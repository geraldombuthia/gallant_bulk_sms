const generateApiKey = require("../utils/apiKeyGen");
const User = require("../models/users");

class AuthService {
    static async register(userData) {
        try {
            userData.apikey = generateApiKey();
            console.log(userData);
            const user = await User.create(userData);
            return user;
        } catch (error) {
            console.error("Error: ", error);
        }
    }

}

module.exports = AuthService;
