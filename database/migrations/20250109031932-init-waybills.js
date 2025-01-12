'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { INTEGER, DATE, STRING } = Sequelize.DataTypes;
    await queryInterface.createTable('waybills', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      car_number: {type: STRING(100), defaultValue: '', allowNull: false},
      car_number_color : {type: INTEGER, defaultValue: '0', allowNull: false},
      cargo_type: {type: INTEGER, defaultValue: '0', allowNull: false},
      cargo_weight: {type: INTEGER, defaultValue: '0', allowNull: false},
      driver_id: {type: INTEGER, defaultValue: '0', allowNull: false},
      driver_name: {type: STRING(100), defaultValue: '', allowNull: false},
      start_location: {type: STRING(100), defaultValue: '', allowNull: false},
      end_location: {type: STRING(100), defaultValue: '', allowNull: false},
      start_location_code: {type: STRING(100), defaultValue: '', allowNull: false},
      end_location_code: {type: STRING(100), defaultValue: '', allowNull: false},
      start_time: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      end_time: {type: DATE, defaultValue: null, allowNull: true},
      status: {type: INTEGER, defaultValue: '0', allowNull: false},
      remark: {type: STRING(2000), defaultValue: '', allowNull: false},
      file_list: {type: STRING(2000), defaultValue: '', allowNull: false},
      end_file_list: {type: STRING(2000), defaultValue: '', allowNull: false},
      extra: {type: STRING(4000), defaultValue: '', allowNull: false},
      created_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      updated_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
    })

    await queryInterface.addIndex('waybills', ['car_number'])
    await queryInterface.addIndex('waybills', ['cargo_type'])
    await queryInterface.addIndex('waybills', ['driver_id'])
    await queryInterface.addIndex('waybills', ['status'])
    await queryInterface.addIndex('waybills', ['start_location_code'])
    await queryInterface.addIndex('waybills', ['end_location_code'])
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   await queryInterface.dropTable('waybills')
  }
};
