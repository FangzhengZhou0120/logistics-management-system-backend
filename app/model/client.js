module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const Client = app.model.define('client', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        clientName: { type: STRING(100), field: 'client_name' },
        remark: STRING(2000),
        address: STRING(400),
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
    });



    return Client;
};