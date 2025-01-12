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
    await queryInterface.createTable('cities', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      city_name: {type: STRING(100), defaultValue: '', allowNull: false},
      city_code: {type: STRING(100), defaultValue: '', allowNull: false},
      parent_name: {type: STRING(100), defaultValue: '', allowNull: false},
      parent_code: {type: STRING(100), defaultValue: '', allowNull: false},
      created_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      updated_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
    })

    await queryInterface.addIndex('cities', ['city_code'])
    await queryInterface.addIndex('cities', ['parent_code'])
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   await queryInterface.dropTable('cities')
  }
};
