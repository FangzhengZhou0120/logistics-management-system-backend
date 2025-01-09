const Controller = require('egg').Controller;

class WaybillController extends Controller {  
    async list() {
        const options = {}
        const body = this.ctx.request.body
        body.id ? options.id = body.id: null
        body.cargoType && body.cargoType.length > 0 ? options.cargoType = body.cargoType: null
        body.driverId && body.driverId > 0 ? options.driverId = body.driverId: null
        body.carNumber ? options.carNumber = body.carNumber: null
        body.startLocationCode ? options.startLocationCode = body.startLocationCode: null
        body.endLocationCode ? options.endLocationCode = body.endLocationCode: null
        body.startTime ? options.startTime = body.startTime : null
        const waybill = await ctx.service.waybill.list({ pageIndex: body.pageIndex, pageSize: body.pageSize, options });
        ctx.body = waybill;
    }

    async create() {
        const { ctx } = this;
        const waybill = await ctx.service.waybill.create(ctx.request.body);
        ctx.body = waybill;
    }

    async update() {
        const { ctx } = this;
        const waybill = await ctx.service.waybill.update(ctx.request.body);
        ctx.body = waybill;
    }

    async delete() {
        const { ctx } = this;
        const waybill = await ctx.service.waybill.destroy(ctx.params.id);
        ctx.body = waybill;
    }

    async find() {
        const { ctx } = this;
        const waybill = await ctx.service.waybill.show(ctx.params.id);
        ctx.body = waybill;
    }
}

module.exports = WaybillController;