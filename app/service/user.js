const Service = require('egg').Service;

class User extends Service {
    async list({ pageIndex = 1, pageSize = 10, options }) {
        const offset = (pageIndex - 1) * pageSize
        return this.ctx.model.User.findAndCountAll({
            where: options,
            offset,
            limit: pageSize,
            order: [['id', 'desc']],
        });
    }

    async create(data) {
        const { ctx } = this;
        const user = await ctx.model.User.create(data);
        return user;
    }

    async update(data) {
        const { ctx } = this;
        const user = await ctx.model.User.findByPk(data.id);
        if (!user) {
            ctx.throw(404, 'user not found');
        }
        await user.update(data);
        return user;
    }

    async destroy(id) {
        const { ctx } = this;
        const user = await ctx.model.User.findByPk(id);
        if (!user) {
            ctx.throw(404, 'user not found');
        }
        await user.destroy();
        return user;
    }

    async show(id) {
        const { ctx } = this;
        const user = await ctx.model.User.findByPk(id);
        if (!user) {
            ctx.throw(404, 'user not found');
        }
        return user;
    }
}

module.exports = User