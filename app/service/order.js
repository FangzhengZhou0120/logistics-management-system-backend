const Service = require('egg').Service;

class Order extends Service {
    async list({ pageIndex = 1, pageSize = 10, options }) {
        if(options.startTime) {
            options.startTime = {[Op.between]: [new Date(options.startTime[0]), new Date(options.startTime[1])]}
        }
        const offset = (pageIndex - 1) * pageSize
        return this.ctx.model.Order.findAndCountAll({
            where: options,
            offset,
            limit: pageSize,
            order: [['id', 'desc']],
        });
    }

    async create(data) {
        const { ctx } = this;
        data.status = 1;
        const order = await ctx.model.Order.create(data);
        return order;
    }

    async update(data) {
        const { ctx } = this;
        const order = await ctx.model.Order.findByPk(data.id);
        if (!order) {
            ctx.throw(500, ORDER_NOT_FOUND);
        }
        await order.update(data);
        return order;
    }

    async find(id) {
        const { ctx } = this;
        const order = await ctx.model.Order.findByPk(id);
        if (!order) {
            ctx.throw(500, ORDER_NOT_FOUND);
        }
        return order
    }

    async destroy(id) {
        const { ctx } = this;
        const order = await ctx.model.Order.findByPk(id);
        if (!order) {
            ctx.throw(500, ORDER_NOT_FOUND);
        }
        await order.destroy();
        return order;
    }

    async getOrderByClient(clientId) {
        const { ctx } = this;
        const orders = await ctx.model.Order.findAll({
            where: {
                clientId
            }
        });
        return orders;
    }

    async getAllOrder() {
        return this.ctx.model.Order.findAll({
            attributes: ['id'],
            order: [['id', 'desc']],
        });
    }
}

module.exports = Order;