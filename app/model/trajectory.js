const waybill = require("./waybill");

module.exports = app => {
    const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

    const Trajectory = app.model.define('trajectory', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        waybillId: { type: INTEGER, field: 'waybill_id' },
        carNumber: { type: STRING(100), field: 'car_number' },
        carNumberColor: { type: INTEGER, field: 'car_number_color' },
        longitude: { type: DOUBLE },
        latitude: { type: DOUBLE },
        direction: { type: INTEGER },
        hgt: { type: DOUBLE },
        speed: { type: DOUBLE },
        mlg: { type: DOUBLE },
        reportAt: { type: DATE, field: 'report_at' },
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
    });

    return Trajectory;
}