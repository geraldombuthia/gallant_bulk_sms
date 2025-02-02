const generateApiKey = require("../utils/apiKeyGen");
const User = require("../models/users");

class AuthService {
    static async register(userData) {
        try {
            userData.apikey = generateApiKey();
            console.log(userData);
            const existingUser = await User.findOne({ where: { username: userData.username } });
            if (existingUser) {
                throw new Error ("User with same username already exists");
                // return res.status(400).json({ error: "Username already exists" });
            }
            const user = await User.create(userData);
            return user;
        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    }

    static async validateAPIKey(apiKey) {
        try {
            const user = await User.findOne({where: {
                apikey: apiKey
            }});

            console.log("User from API Key", user.get({ plain: true }));
            if (!user) {
                throw new Error("Invalid API Key");
            }
            return user.get({ plain: true });
        } catch(error) {
            console.error("Error: ", error);
            throw error;
        }
    }

}

module.exports = AuthService;
