module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const Waybill = app.model.define('waybill', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        carNumber: { type: STRING(100), field: 'car_number' },
        carNumberColor: { type: INTEGER, field: 'car_number_color' },
        cargoType: { type: INTEGER, field: 'cargo_type' },
        cargoWeight: { type: INTEGER, field: 'cargo_weight' },
        driverId: { type: INTEGER, field: 'driver_id' },
        driverName: { type: STRING(100), field: 'driver_name' },
        startLocation: { type: STRING(100), field: 'start_location' },
        endLocation: { type: STRING(100), field: 'end_location' },
        startLocationCode: { type: STRING(100), field: 'start_location_code' },
        endLocationCode: { type: STRING(100), field: 'end_location_code' },
        startTime: { type: DATE, field: 'start_time' },
        endTime: { type: DATE, field: 'end_time' },
        status: { type: INTEGER, field: 'status' },
        remark: { type: STRING(2000), field: 'remark' },
        fileList: { type: STRING(2000), field: 'file_list' },
        endFileList: { type: STRING(2000), field: 'end_file_list' },
        extra: { type: STRING(4000) },
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
    });



    return Waybill;
};