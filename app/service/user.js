const Service = require('egg').Service;

class User extends Service {
    async list({ pageIndex = 1, pageSize = 10, options }) {
        const offset = (pageIndex - 1) * pageSize
        return this.ctx.model.User.findAndCountAll({
            attributes: { exclude: ['password'] },
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
        const user = await ctx.model.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            ctx.throw(404, 'user not found');
        }
        return user;
    }

    async getUserByRole(role) {
        const { ctx } = this;
        const user = await ctx.model.User.findAll({
            attributes: { exclude: ['password'] },
            where: {
                role
            }
        });
        return user
    }
}

module.exports = User