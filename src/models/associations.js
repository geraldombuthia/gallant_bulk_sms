// models/associations.js
module.exports = (sequelize) => {
    const {User, Credit, Payment, SMSCredit} = sequelize.models;
  
    // Define relationships
    User.hasMany(Credit);
    Credit.belongsTo(User, { foreignKey: 'userId'});
    Credit.belongsTo(Payment, {foreignKey: "paymentId"});
  
    User.hasMany(Payment);
    Payment.belongsTo(User);

    User.hasOne(SMSCredit, { foreignKey: "userId"});
    SMSCredit.belongsTo(User, { foreignKey: "userId"});


};