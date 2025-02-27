const Controller = require('egg').Controller;

class OrderController extends Controller {
    async list() {
        const { ctx } = this;
        const options = {}
        const body = this.ctx.request.body
        body.id ? options.id = body.id : null
        body.cargoType && body.cargoType.length > 0 ? options.cargoType = body.cargoType : null
        body.endLocationCode ? options.endLocationCode = body.endLocationCode : null
        const user = ctx.session.user
        if(user.role === 3) {
            options.clientId = user.clientId
        }
        const order = await ctx.service.order.list({ pageIndex: body.pageIndex, pageSize: body.pageSize, options });
        ctx.body = order;
    }

    async create() {
        const { ctx } = this;
        const order = await ctx.service.order.create(ctx.request.body);
        ctx.body = order;
    }

    async update() {
        const { ctx } = this;
        const order = await ctx.service.order.update(ctx.request.body);
        ctx.body = order;
    }

    async delete() {
        const { ctx } = this;
        const order = await ctx.service.order.find(ctx.request.body.id);
        if (!order) {
            ctx.throw(500, ORDER_NOT_FOUND);
        }
        await order.update({status: 99});
        ctx.body = order;
    }

    async find() {
        const { ctx } = this;
        const order = await ctx.service.order.find(ctx.query.id);
        ctx.body = order;
    }

    async getOrderByClient() {
        const { ctx } = this;
        const user = ctx.session.user
        const orders = await ctx.service.order.getOrderByClient(user.clientId);
        ctx.body = orders;
    }

    async finishOrder() {
        const { ctx } = this;
        const order = await ctx.service.order.find(ctx.request.body.id);
        if (!order) {
            ctx.throw(500, ORDER_NOT_FOUND);
        }
        await order.update({status: 2, endTime: new Date()});
        ctx.body = order;
    }

    async getAllOrder() {
        const { ctx } = this;
        const user = ctx.session.user
        const options = {}
        if(user.role === 3) {
            options.clientId = user.clientId
        }
        const orders = await ctx.service.order.getAllOrder(options);
        ctx.body = orders;
    }
}

module.exports = OrderController;