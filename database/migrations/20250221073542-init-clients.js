'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING } = Sequelize.DataTypes;
    await queryInterface.createTable('clients', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      client_name: {type: STRING(100), defaultValue: '', allowNull: false},
      remark: {type: STRING(2000), defaultValue: '', allowNull: false},
      address: {type: STRING(400), defaultValue: '', allowNull: false},
      created_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      updated_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('clients')
  }
};
