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
    await queryInterface.createTable('orders', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      cargo_type: {type: INTEGER, defaultValue: '0', allowNull: false},
      cargo_count: {type: STRING(200), defaultValue: '', allowNull: false},
      end_location: {type: STRING(100), defaultValue: '', allowNull: false},
      end_location_code: {type: STRING(100), defaultValue: '', allowNull: false},
      end_address: {type: STRING(200), defaultValue: '', allowNull: false},
      end_time: {type: DATE, defaultValue: null, allowNull: true},
      status: {type: INTEGER, defaultValue: '0', allowNull: false},
      remark: {type: STRING(2000), defaultValue: '', allowNull: false},
      sender: {type: STRING(100), defaultValue: '', allowNull: false},
      receiver: {type: STRING(100), defaultValue: '', allowNull: false},
      sender_phone: {type: STRING(100), defaultValue: '', allowNull: false},
      receiver_phone: {type: STRING(100), defaultValue: '', allowNull: false},
      client_id: {type: INTEGER, defaultValue: '0', allowNull: false},
      client_name: {type: STRING(100), defaultValue: '', allowNull: false},
      extra: {type: STRING(2000), defaultValue: '', allowNull: false},
      created_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
      updated_at: {type: DATE, defaultValue: Sequelize.fn('now'), allowNull: false},
    })

    await queryInterface.addIndex('orders', ['client_name'])
    await queryInterface.addIndex('orders', ['sender'])
    await queryInterface.addIndex('orders', ['end_location_code'])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('orders')
  }
};
