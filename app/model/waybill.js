const { start } = require("egg");
const client = require("./client");

module.exports = app => {
    const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

    const Waybill = app.model.define('waybill', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        carNumber: { type: STRING(100), field: 'car_number' },
        carNumberColor: { type: INTEGER, field: 'car_number_color' },
        cargoType: { type: STRING(20), field: 'cargo_type' },
        cargoWeight: { type: DOUBLE, field: 'cargo_weight' },
        driverId: { type: INTEGER, field: 'driver_id' },
        driverName: { type: STRING(100), field: 'driver_name' },
        startLocation: { type: STRING(100), field: 'start_location' },
        endLocation: { type: STRING(100), field: 'end_location' },
        startLocationCode: { type: STRING(100), field: 'start_location_code' },
        endLocationCode: { type: STRING(100), field: 'end_location_code' },
        startAddress: { type: STRING(200), field: 'start_address' },
        endAddress: { type: STRING(200), field: 'end_address' },
        startTime: { type: DATE, field: 'start_time' },
        endTime: { type: DATE, field: 'end_time' },
        status: { type: INTEGER, field: 'status' },
        remark: { type: STRING(2000), field: 'remark' },
        fileList: { type: STRING(2000), field: 'file_list' },
        endFileList: { type: STRING(2000), field: 'end_file_list' },
        extra: { type: STRING(4000) },
        sender: { type: STRING(100) },
        receiver: { type: STRING(100) },
        senderPhone: { type: STRING(100), field: 'sender_phone' },
        receiverPhone: { type: STRING(100), field: 'receiver_phone' },
        clientId: { type: INTEGER, field: 'client_id'},
        clientName: { type: STRING(100), field: 'client_name' },
        orderId: { type: INTEGER, field: 'order_id' },
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
        receiveCompany: {type: STRING(100), field: 'receive_company'},
        waybillNumber: {type: STRING(200), field: 'waybill_number'},
        pickUpPhone: {type: STRING(20), field: 'pick_up_phone'},
        cargoCount: {type: INTEGER, field: 'cargo_count'},
        cargoVolume: {type: DOUBLE, field: 'cargo_volume'},
    });



    return Waybill;
};