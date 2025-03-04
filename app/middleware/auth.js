module.exports = () => {
    return async function auth(ctx, next) {
      // Skip auth check for login route
      if (ctx.path === '/api/login') {
        return await next();
      }
  
      // Check if user is logged in
      const user = ctx.session.user;
      if (!user) {
        ctx.status = 401;
        ctx.body = { 
          success: false, 
          message: '请先登录' 
        };
        return;
      }
  
      await next();
    };
  };