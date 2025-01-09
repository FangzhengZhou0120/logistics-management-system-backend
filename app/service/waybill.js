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
        const waybill = await ctx.model.Waybill.create(data);
        return waybill;
    }

    async update(data) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findByPk(data.id);
        if (!waybill) {
            ctx.throw(404, 'waybill not found');
        }
        await waybill.update(data);
        return waybill;
    }

    async destroy(id) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findByPk(id);
        if (!waybill) {
            ctx.throw(404, 'waybill not found');
        }
        await waybill.destroy();
        return waybill;
    }

    async show(id) {
        const { ctx } = this;
        const waybill = await ctx.model.Waybill.findByPk(id);
        if (!waybill) {
            ctx.throw(404, 'waybill not found');
        }
        return waybill;
    }

    // async index() {
    //     const { ctx } = this;
    //     const waybill = await ctx.model.Waybill.findAll();
    //     return waybill;
    // }
}

module.exports = Waybill