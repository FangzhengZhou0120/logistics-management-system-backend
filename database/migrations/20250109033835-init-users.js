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
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_name: {type: STRING(100), defaultValue: '', allowNull: false},
      password: {type: STRING(200), defaultValue: '', allowNull: false},
      role: {type: INTEGER, defaultValue: '0', allowNull: false},
      phone: {type: STRING(100), defaultValue: '', allowNull: false},
      remark: {type: STRING(2000), defaultValue: '', allowNull: false},
      client_id: {type: INTEGER, defaultValue: '0', allowNull: false},
      client_name: {type: STRING(100), defaultValue: '', allowNull: false},
      created_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      updated_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
    })

    await queryInterface.addIndex('users', ['role'])
    await queryInterface.addIndex('users', ['user_name'])
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   await queryInterface.dropTable('users')
  }
};
