module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const City = app.model.define('city', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        cityName: { type: STRING(100), field: 'city_name' },
        cityCode: { type: STRING(100), field: 'city_code' },
        parentName: { type: STRING(100), field: 'parent_name' },
        parentCode: { type: STRING(100), field: 'parent_code' },
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
    });



    return City;
};