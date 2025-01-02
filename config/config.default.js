/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1735787647056_9638';

  // add your middleware config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'logistics_management',
    username: 'root',
    password: '13b71a1b',
    define: {
      underscored: false,
    }
  };

  config.onerror = {
    all(err, ctx) {
      // 定义所有响应类型的错误处理方法
      // 定义了 config.all 后，其他错误处理不再生效
      ctx.body = JSON.stringify(err);
      ctx.status = 500;
    }
  }


  config.cors = {
    origin: '*', // 允许的前端来源
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true, // 如果需要支持带有 cookie 的请求
  };

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'auth',
      db: 0,
    },
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
