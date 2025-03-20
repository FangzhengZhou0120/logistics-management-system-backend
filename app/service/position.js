const Service = require('egg').Service;
const { sinoiovHttpsCall } = require('../utility/request-sinoiov');
const { SINOIOV_BASE_URL } = require('../utility/constants');
const { parseCustomDateString } = require('../utility/helper');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const { transformDate } = require('../utility/helper');

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
        const MAX_TIME_RANGE = 72 * 60 * 60 * 1000; // 72 hours
        if (!trajectory || trajectory.reportAt < endTime) {
            let allTrackData = [];
            if (endTime - startTime > MAX_TIME_RANGE) {
                // Split into multiple 72-hour chunks
                let currentStartTime = startTime;

                while (currentStartTime < endTime) {
                    // Calculate chunk end time (either 72 hours later or the overall end time)
                    let chunkEndTime = Math.min(currentStartTime + MAX_TIME_RANGE, endTime);

                    try {
                        const url = `${SINOIOV_BASE_URL}routerPath`;
                        const reqParam = {
                            cid: process.env.SINOIOV_CID,
                            vclN: carNumber,
                            vco: carNumberColor,
                            qryBtm: transformDate(currentStartTime),
                            qryEtm: transformDate(chunkEndTime),
                            srt: process.env.SINOIOV_SRT,
                        };

                        const res = await sinoiovHttpsCall(url, reqParam);

                        if (res.result && res.result.trackArray) {
                            allTrackData = allTrackData.concat(res.result.trackArray);
                        }
                    } catch (error) {
                        this.ctx.logger.error(`Failed to fetch trajectory for chunk ${currentStartTime} to ${chunkEndTime}: ${error.message}`);
                    }

                    // Move to the next chunk
                    currentStartTime = chunkEndTime;
                }
            } else {
                const url = `${SINOIOV_BASE_URL}routerPath`;
                const reqParam = {
                    cid: process.env.SINOIOV_CID,
                    vclN: carNumber,
                    vco: carNumberColor,
                    qryBtm: transformDate(startTime),
                    qryEtm: transformDate(endTime),
                    srt: process.env.SINOIOV_SRT,
                };
                const res = await sinoiovHttpsCall(url, reqParam);
                if (res.result && res.result.trackArray) {
                    allTrackData = res.result.trackArray;
                }
            }

            let data = allTrackData

            if (trajectory) {
                data = allTrackData.filter((it) => {
                    return parseCustomDateString(it.gtm).getTime() > trajectory.reportAt;
                });
            }
            if (data && data.length > 0) {
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
                reportAt: {
                    [Op.gte]: startTime,
                    [Op.lte]: endTime
                }
            },
            order: [
                ['reportAt', 'ASC']
            ]
        })
        return trajectory
    }
}

module.exports = Position;