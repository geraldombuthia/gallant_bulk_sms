const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const SMSCredits = require("./smsCredits.model");
const EmailCredits = require("./emailCredit.model");
const RegisterCredit = require("./registerCredit.model");
const bcrypt = require("bcrypt");

class User extends Model {
  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    apikey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
    },
    registered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelname: "user",
    tableName: "users",
    timestamps: true, // Disable Sequelize's automatic timestamp handling
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

User.beforeUpdate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

User.afterCreate(async (user, options) => {
  // Create SMS Credits record for the new User
  console.log("User created", user);
  try {
    await SMSCredits.create({
      userId: user.id,
      price_per_unit: 1, // default price for SMS
      creditBalance: 2, // default credit balance set to 2
    });

    // Create Email Credits record for the new User
    await EmailCredits.create({
      userId: user.id,
      price_per_unit: 0.001, // default price for Email
      creditBalance: 100, // default credit balance set to 10
    });

    // Create Register Credit record for the new User
    // Create RegisterCredit record for the new user
    await RegisterCredit.create({
      userId: user.id,
      isRegistered: true, // assuming the user is registered at the point of creation
    });

    console.log("User and related records initialized!");
  } catch (error) {
    console.error("Failed to initialize user related records", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
});
module.exports = User;
