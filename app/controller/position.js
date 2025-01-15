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
        const qryStartTime = startTime && startTime < now ? transformDate(new Date(startTime)) : transformDate(new Date(now))
        const qryEndTime = endTime && endTime < now ? transformDate(new Date(endTime)) : transformDate(new Date(now))
        const trajectory = await ctx.service.position.getTrajectory(waybillId, carNumber, carNumberColor.toString(), qryStartTime, qryEndTime)
        ctx.body = trajectory
    }
}

module.exports = PositionController