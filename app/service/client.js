const Service = require('egg').Service;

class Client extends Service {
    async list({ pageIndex = 1, pageSize = 10, options }) {
        const offset = (pageIndex - 1) * pageSize
        if (options.clientName) {
            options.clientName = { [Op.like]: `%${options.clientName}%` }
        }
        return this.ctx.model.Client.findAndCountAll({
            where: options,
            offset,
            limit: pageSize,
            order: [['id', 'desc']],
        });
    }

    async create(data) {
        const { ctx } = this;
        const client = await ctx.model.Client.create(data);
        return client;
    }

    async update(data) {
        const { ctx } = this;
        const client = await ctx.model.Client.findByPk(data.id);
        if (!client) {
            ctx.throw(500, CLIENT_NOT_FOUND);
        }
        await client.update(data);
        return client;
    }

    async destroy(id) {
        const { ctx } = this;
        const client = await ctx.model.Client.findByPk(id);
        if (!client) {
            ctx.throw(500, CLIENT_NOT_FOUND);
        }
        await client.destroy();
        return client;
    }
}

module.exports = Client;