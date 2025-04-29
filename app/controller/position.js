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

        const cacheKey = `trajectory:${waybillId}:${carNumber}:${carNumberColor}:${qryStartTime}:${endTime? qryEndTime : 0}`

        let trajectory = await ctx.app.redis.get(cacheKey)
        
        if (trajectory) {
            // If found in cache, parse the JSON string and return
            ctx.body = JSON.parse(trajectory)
            return
        }
        
        trajectory = await ctx.service.position.getTrajectory(waybillId, carNumber, carNumberColor.toString(), qryStartTime, qryEndTime)

        // Store in Redis with 5-minute expiration (300 seconds)
        await ctx.app.redis.set(cacheKey, JSON.stringify(trajectory), 'EX', 300)
        ctx.body = trajectory
    }
}

module.exports = PositionController