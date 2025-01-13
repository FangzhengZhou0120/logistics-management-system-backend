const Controller = require('egg').Controller;

class UserController extends Controller {
    async list() {
        const options = {}
        const body = this.ctx.request.body
        body.id ? options.id = body.id: null
        body.username ? options.username = body.username: null
        body.role && body.role.length > 0 ? options.role = body.role: null
        const user = await this.ctx.service.user.list({ pageIndex: body.pageIndex, pageSize: body.pageSize, options });
        this.ctx.body = user;
    }

    async create() {
        const { ctx } = this;
        const user = await ctx.service.user.create(ctx.request.body);
        ctx.body = user;
    }

    async update() {
        const { ctx } = this;
        const user = await ctx.service.user.update(ctx.request.body);
        ctx.body = user;
    }

    async delete() {
        const { ctx } = this;
        const user = await ctx.service.user.destroy(ctx.params.id);
        ctx.body = user;
    }

    async find() {
        const { ctx } = this;
        const user = await ctx.service.user.show(ctx.params.id);
        ctx.body = user;
    }

    async getUserByRole() {
        const { ctx } = this;
        const users = await ctx.service.user.getUserByRole(ctx.query.role);
        ctx.body = users;
    }

    async login() {
        const { ctx } = this;
        const { username, password } = ctx.request.body;
        const user = await ctx.model.User.findOne({
            where: {
                username,
                password
            }
        });
        if (user) {
            ctx.session.user = user;
            ctx.body = user;
        } else {
            ctx.throw(401, '用户名或密码错误');
        }
    }
}

module.exports = UserController;