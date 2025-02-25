const Controller = require('egg').Controller;

class ClientController extends Controller {
    async list() {
        const options = {}
        const body = this.ctx.request.body
        body.id ? options.id = body.id: null
        body.clientName ? options.clientName = body.clientName: null
        const client = await this.ctx.service.client.list({ pageIndex: body.pageIndex, pageSize: body.pageSize, options });
        this.ctx.body = client;
    }

    async create() {
        const { ctx } = this;
        const client = await ctx.service.client.create(ctx.request.body);
        ctx.body = client;
    }

    async update() {
        const { ctx } = this;
        const client = await ctx.service.client.update(ctx.request.body);
        ctx.body = client;
    }

    async delete() {
        const { ctx } = this;
        const client = await ctx.service.client.destroy(ctx.request.body.id);
        ctx.body = client;
    }
}

module.exports = ClientController;