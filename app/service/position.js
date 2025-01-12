const Service = require('egg').Service;
const { sinoiovHttpsCall } = require('../utility/request-sinoiov');
const { SINOIOV_BASE_URL } = require('../utility/constants');
const { parseCustomDateString } = require('../utility/helper');

class Position extends Service {

    async getVehiclePosition(carNumber, startAreaCode, endAreaCode) {
        const url = `${SINOIOV_BASE_URL}transTimeManageV3`;
        const reqParam = {
            cid: process.env.SINOIOV_CID,
            vnos: carNumber,
            timeNearby: '24',
            srt: process.env.SINOIOV_SRT,
        };
        const res = await sinoiovHttpsCall(url, reqParam);
        const data = res.result.firstVcl
        data.lat = Number(res.result.firstVcl.lat) / 600000
        data.lon = Number(res.result.firstVcl.lon) / 600000
        return data
    }

    async getTrajectory(waybillId, carNumber, carNumberColor, startTime, endTime) {
        const trajectory = await this.getLatestTrajectory(waybillId);
        if (!trajectory || trajectory.reportAt < endTime) {
            const url = `${SINOIOV_BASE_URL}routerPath`;
            const reqParam = {
                cid: process.env.SINOIOV_CID,
                vclN: carNumber,
                vco: carNumberColor,
                qryBtm: startTime,
                qryEtm: endTime,
                srt: process.env.SINOIOV_SRT,
            };
            const res = await sinoiovHttpsCall(url, reqParam);
            let data = res.result.trackArray
            console.log(data)
            if (trajectory) {
                data = res.result.trackArray.filter((it) => {
                    return parseCustomDateString(it.gtm).getTime() > trajectory.reportAt
                })
            }
            data = data.map((item) => {
                return {
                    waybillId,
                    carNumber,
                    carNumberColor,
                    longitude: Number(item.lon) / 600000,
                    latitude: Number(item.lat) / 600000,
                    direction: Number(item.agl),
                    hgt: Number(item.hgt),
                    speed: Number(item.spd),
                    mlg: Number(item.mlg),
                    reportAt: parseCustomDateString(item.gtm).getTime(),
                }
            });
            await this.ctx.model.Trajectory.bulkCreate(data);
        }
        return this.getTrajectoryList(waybillId, startTime, endTime);
    }


    async getLatestTrajectory(waybillId) {
        const trajectory = await this.ctx.model.Trajectory.findOne({
            where: {
                waybillId,
            },
            order: [
                ['reportAt', 'DESC']
            ]
        })
        return trajectory
    }

    async getTrajectoryList(waybillId, startTime, endTime) {
        const trajectory = await this.ctx.model.Trajectory.findAll({
            where: {
                waybillId,
            },
            order: [
                ['reportAt', 'ASC']
            ]
        })
        return trajectory
    }
}

module.exports = Position;