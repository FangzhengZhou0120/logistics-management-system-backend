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
    const { INTEGER, DATE, STRING, DOUBLE } = Sequelize.DataTypes;
    await queryInterface.createTable('trajectories', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      waybill_id: {type: INTEGER, defaultValue: '0', allowNull: false},
      car_number: {type: STRING(100), defaultValue: '', allowNull: false},
      car_number_color: {type: INTEGER, defaultValue: '0', allowNull: false},
      longitude: {type: DOUBLE, defaultValue: '0', allowNull: false},
      latitude: {type: DOUBLE, defaultValue: '0', allowNull: false},
      direction: {type: INTEGER, defaultValue: '0', allowNull: false},
      hgt: {type: DOUBLE, defaultValue: '0', allowNull: false},
      speed: {type: DOUBLE, defaultValue: '0', allowNull: false},
      mlg: {type: DOUBLE, defaultValue: '0', allowNull: false},
      report_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      created_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      updated_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
    })

    await queryInterface.addIndex('trajectories', ['waybill_id'])
    await queryInterface.addIndex('trajectories', ['car_number'])
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   await queryInterface.dropTable('trajectories')
  }
};
