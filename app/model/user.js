const client = require("./client");

module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const User = app.model.define('user', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        userName: { type: STRING(100), field: 'user_name' },
        password: STRING(200),
        role: INTEGER,
        phone: STRING(100),
        remark: STRING(2000),
        clientId: { type: INTEGER, field: 'client_id' },
        clientName: { type: STRING(100), field: 'client_name' },
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
    });



    return User;
};