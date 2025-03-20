const { transformDate } = require('../utility/helper');

const Controller = require('egg').Controller;

class PositionController extends Controller {
    async getVehiclePosition() {
        const { ctx } = this;
        const { carNumber, startAreaCode, endAreaCode } = ctx.request.body;
        const position = await ctx.service.position.getVehiclePosition(carNumber, startAreaCode, endAreaCode);
        ctx.body = position;
    }

    async getTrajectory() {
        const { ctx } = this
        const { waybillId, carNumber, carNumberColor, startTime, endTime } = ctx.request.body
        const now = new Date().getTime()
        const qryStartTime = startTime && new Date(startTime).getTime() < now ? new Date(startTime).getTime() :new Date(now).getTime()
        const qryEndTime = endTime && new Date(endTime).getTime() < now ? new Date(endTime).getTime() : new Date(now).getTime()
        const trajectory = await ctx.service.position.getTrajectory(waybillId, carNumber, carNumberColor.toString(), qryStartTime, qryEndTime)
        ctx.body = trajectory
    }
}

module.exports = PositionController