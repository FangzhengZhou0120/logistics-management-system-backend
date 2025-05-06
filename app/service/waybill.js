const { WAYBILL_NOT_FOUND } = require('../utility/error-code');
const { Op } = require('sequelize');

const Service = require('egg').Service;

class Waybill extends Service {
    async list({ pageIndex = 1, pageSize = 10, options }) {
        if(options.startTime) {
            options.startTime = {[Op.between]: [new Date(options.startTime[0]), new Date(options.startTime[1])]}
        }
        const offset = (pageIndex - 1) * pageSize
        return this.ctx.model.Waybill.findAndCountAll({
            where: options,
            offset,
            limit: pageSize,
            order: [['id', 'desc']],
        });
    }

    async create(data) {
        const { ctx } = this;
        data.status = 1;
        data.startTime = data.startTime ? new Date(data.startTime) : null;
        const waybill = await ctx.model.Waybill.create(data);
        return waybill;
    }

    async update(data) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findByPk(data.id);
        if (!waybill) {
            ctx.throw(500, WAYBILL_NOT_FOUND);
        }
        await waybill.update(data);
        return waybill;
    }

    async destroy(id) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findByPk(id);
        if (!waybill) {
            ctx.throw(500, WAYBILL_NOT_FOUND);
        }
        waybill.status = 99
        waybill.endTime = new Date()
        await waybill.update(waybill);
        return waybill;
    }

    async show(id) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findByPk(id);
        if (!waybill) {
            ctx.throw(500, WAYBILL_NOT_FOUND);
        }
        return waybill;
    }

    async getWaybillIdByOrderId(orderId) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findOne({
            where: {
                orderId,
                status: [0, 1]
            }
        });
        return waybill;
    }

    // async index() {
    //     const { ctx } = this;
    //     const waybill = await ctx.model.Waybill.findAll();
    //     return waybill;
    // }
}

module.exports = Waybill