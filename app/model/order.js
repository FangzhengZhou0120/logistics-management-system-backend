const client = require("./client");

module.exports = app => {
    const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

    const Order = app.model.define('order', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        cargoType: { type: STRING(20), field: 'cargo_type' },
        cargoCount: { type: STRING(200), field: 'cargo_count' },
        endLocation: { type: STRING(100), field: 'end_location' },
        endLocationCode: { type: STRING(100), field: 'end_location_code' },
        endAddress: { type: STRING(200), field: 'end_address' },
        endTime: { type: DATE, field: 'end_time' },
        status: { type: INTEGER, field: 'status' },
        remark: { type: STRING(2000), field: 'remark' },
        extra: { type: STRING(2000) },
        sender: { type: STRING(100) },
        receiver: { type: STRING(100) },
        senderPhone: { type: STRING(100), field: 'sender_phone' },
        receiverPhone: { type: STRING(100), field: 'receiver_phone' },
        clientId: { type: INTEGER, field: 'client_id'},
        clientName: { type: STRING(100), field: 'client_name' },
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
        pickUpDate: {type: DATE, field: 'pick_up_date'},
        receiveCompany: {type: STRING(100), field: 'receive_company'},
        cargoWeight: { type: DOUBLE, field: 'cargo_weight' },
        cargoVolume: { type: DOUBLE, field: 'cargo_volume' },
    });

    return Order;
}