const { OSS_BUCKET, OSS_REGION } = require('../utility/constants');
const { WAYBILL_NOT_FOUND } = require('../utility/error-code');
// const { getCredential, generateExpiration, hmacsha256, getOssObejctUrl } = require('../utility/helper');

const Controller = require('egg').Controller;

class WaybillController extends Controller {
    async list() {
        const { ctx } = this;
        const options = {}
        const body = this.ctx.request.body
        body.id ? options.id = body.id : null
        body.cargoType ? options.cargoType = body.cargoType : null
        body.driverId && body.driverId > 0 ? options.driverId = body.driverId : null
        body.carNumber ? options.carNumber = body.carNumber : null
        body.startLocationCode ? options.startLocationCode = body.startLocationCode : null
        body.endLocationCode ? options.endLocationCode = body.endLocationCode : null
        body.startTime ? options.startTime = body.startTime : null
        body.status && body.status.length > 0 ? options.status = body.status : null
        body.waybillNumber ? options.waybillNumber = body.waybillNumber : null
        const user = ctx.session.user
        if(user.role === 3) {
            options.clientId = user.clientId
        }
        const waybill = await ctx.service.waybill.list({ pageIndex: body.pageIndex, pageSize: body.pageSize, options });
        ctx.body = waybill;
    }

    async create() {
        const { ctx } = this;
        const waybill = await ctx.service.waybill.create(ctx.request.body);
        await ctx.service.order.update({id: ctx.request.body.orderId, status: 1});
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
        const waybill = await ctx.service.waybill.show(ctx.query.id);
        //waybill.fileList = waybill.fileList ? waybill.fileList.split(",").map(it => getOssObejctUrl(it)).join(",") : ""
        //waybill.endFileList = waybill.endFileList ? waybill.endFileList.split(",").map(it => getOssObejctUrl(it)).join(",") : ""
        ctx.body = waybill;
    }

    // async getUploadConfig() {
    //     try {
    //         const { ctx } = this;
    //         const bucket = OSS_BUCKET;         // 你的 OSS Bucket 名称
    //         const region = OSS_REGION;               // Bucket 所在地域
    //         const host = `http://${bucket}.oss-${region}.aliyuncs.com`;
    //         const uploadDir = "waybill-check-pic";                    // 上传到 OSS 时的 Key 前缀
    //         const expireTime = 3600;                    // 签名过期时间（秒）= 1小时
    //         // 1) 获取 STS 临时凭证
    //         const stsData = await getCredential();
    //         const accessKeyId = stsData.accessKeyId;
    //         const accessKeySecret = stsData.accessKeySecret;
    //         const securityToken = stsData.securityToken;

    //         // 2) 生成日期：yyyyMMdd
    //         const now = new Date();
    //         const date = [
    //             now.getUTCFullYear(),
    //             String(now.getUTCMonth() + 1).padStart(2, "0"),
    //             String(now.getUTCDate()).padStart(2, "0"),
    //         ].join(""); // e.g. 20250112

    //         // 生成日期时间：yyyyMMdd'T'HHmmss'Z'
    //         const dateTime = [
    //             date,
    //             "T",
    //             String(now.getUTCHours()).padStart(2, "0"),
    //             String(now.getUTCMinutes()).padStart(2, "0"),
    //             String(now.getUTCSeconds()).padStart(2, "0"),
    //             "Z",
    //         ].join(""); // e.g. 20250112T104522Z

    //         // 3) 组装 x-oss-credential
    //         const xOssCredential = `${accessKeyId}/${date}/${region}/oss/aliyun_v4_request`;

    //         // 4) 构造 Policy
    //         const policy = {
    //             expiration: generateExpiration(expireTime), // 过期时间
    //             conditions: [
    //                 // (4.1) 必须是该 bucket
    //                 { bucket: bucket },
    //                 // (4.2) 临时安全令牌
    //                 { "x-oss-security-token": securityToken },
    //                 // (4.3) 签名版本
    //                 { "x-oss-signature-version": "OSS4-HMAC-SHA256" },
    //                 // (4.4) x-oss-credential
    //                 { "x-oss-credential": xOssCredential },
    //                 // (4.5) x-oss-date
    //                 { "x-oss-date": dateTime },
    //                 // 文件大小限制 (示例：1Byte ~ 10MB)
    //                 ["content-length-range", 1, 10240000],
    //                 // 上传成功后返回 200
    //                 ["eq", "$success_action_status", "200"],
    //                 // 文件 key 需要以 uploadDir 开头
    //                 ["starts-with", "$key", uploadDir],
    //             ],
    //         };

    //         // 5) Base64 编码后得到的字符串即 StringToSign
    //         const policyJson = JSON.stringify(policy);
    //         const stringToSign = Buffer.from(policyJson).toString("base64");

    //         // 6) 计算签名 (OSS V4)
    //         //    6.1 先构造出 signingKey
    //         const dateKey = hmacsha256(`aliyun_v4${accessKeySecret}`, date);
    //         const dateRegionKey = hmacsha256(dateKey, region);
    //         const dateRegionServiceKey = hmacsha256(dateRegionKey, "oss");
    //         const signingKey = hmacsha256(dateRegionServiceKey, "aliyun_v4_request");

    //         //    6.2 得到最终 signature = HEX( HMAC-SHA256(signingKey, stringToSign) )
    //         const signatureBuf = hmacsha256(signingKey, stringToSign);
    //         const signature = signatureBuf.toString("hex");

    //         // 7) 返回给前端的参数
    //         const responseData = {
    //             version: "OSS4-HMAC-SHA256",
    //             policy: stringToSign,         // Policy 的 Base64 字符串
    //             credential: xOssCredential,
    //             ossdate: dateTime,
    //             signature: signature,
    //             token: securityToken,         // STS 临时令牌
    //             dir: uploadDir,
    //             host: host,
    //         };
    //         ctx.body = responseData;
    //     } catch (err) {
    //         console.error("Error in getUploadConfig: ", err);
    //         ctx.body = JSON.stringify(err);
    //     }
    // }

    async finsihWaybill() {
        const { ctx } = this;
        const {id, endTime, endFileList, orderId} = ctx.request.body;
        const updatedWaybill = await ctx.service.waybill.update({ id, endTime, endFileList, status: 2 });
        const waybills = await ctx.service.waybill.getWaybillIdByOrderId(orderId);
        if(!waybills) {
            await ctx.service.order.update({id: orderId, status: 2, endTime: new Date()});
        }
        ctx.body = updatedWaybill;
    }

    async cancelWaybill() {
        const { ctx } = this;
        const {id} = ctx.request.body;
        const waybill = await ctx.service.waybill.update({id, status: 99, endTime: new Date()});
        ctx.body = waybill;
    }
}

module.exports = WaybillController;