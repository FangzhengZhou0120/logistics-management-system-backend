const dayjs = require('dayjs')
const Sts20150401 = require("@alicloud/sts20150401");
const OpenApi = require("@alicloud/openapi-client");
const { RuntimeOptions } = require("@alicloud/tea-util");
const crypto = require("crypto");
const { OSS_BUCKET, OSS_REGION } = require('./constants');
const OSS = require("ali-oss");
const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
  region: "oss-cn-shenzhen",
  // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
  accessKeyId: process.env.OSS_ACCESS_ID,
  accessKeySecret: process.env.OSS_ACCESS_SECRET,
  // 填写Bucket名称，例如examplebucket。
  bucket: OSS_BUCKET,
});

function parseCustomDateString(dateString) {
    const [datePart, timePart] = dateString.split('/')
    
    const year = datePart.substring(0, 4)
    const month = datePart.substring(4, 6) - 1  // JS months are 0-based
    const day = datePart.substring(6, 8)
    
    const hour = timePart.substring(0, 2)
    const minute = timePart.substring(2, 4)
    const second = timePart.substring(4, 6)
    
    return new Date(year, month, day, hour, minute, second)
}

function transformDate(date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}


// const bucket = OSS_BUCKET;         // 你的 OSS Bucket 名称
// const region = OSS_REGION;               // Bucket 所在地域
// const host = `http://${bucket}.oss-${region}.aliyuncs.com`;
// const uploadDir = "waybill-check-pic";                    // 上传到 OSS 时的 Key 前缀
// const expireTime = 3600;                    // 签名过期时间（秒）= 1小时

// ---------------------- 1. 生成过期时间（ISO8601 格式） ---------------------- //
function generateExpiration(seconds) {
  // 过期时间戳（毫秒）
  const exp = Date.now() + seconds * 1000;
  // 转成 `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` 格式
  return new Date(exp).toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

// ---------------------- 2. 创建 STS Client (基于 OpenAPI) ---------------------- //
function createStsClient() {
  // 尽量不要在代码里硬编码 AK/SK，使用环境变量或更安全的配置方式
  const config = new OpenApi.Config({
    accessKeyId: process.env.OSS_ACCESS_ID,      // 请确保已设置环境变量
    accessKeySecret: process.env.OSS_ACCESS_SECRET, // 请确保已设置环境变量
    endpoint: "sts.cn-shenzhen.aliyuncs.com",
  });
  return new Sts20150401.default(config);
}

// ---------------------- 3. 获取 STS 临时凭证 ---------------------- //
async function getCredential() {
  const client = createStsClient();
  
  // 注意：此处演示使用 `setRoleArn(...)` 传的内容与 Java 代码示例不同。
  //       在实际项目里，应使用你自己的 RoleArn，例如：acs:ram::1234567890123456:role/yourRoleName
  //       切勿直接将 AK 填在 roleArn 中，否则无法生效。
  const assumeRoleRequest = new Sts20150401.AssumeRoleRequest({
    // 真实项目中，RoleArn 类似：acs:ram::1234567890123456:role/yourRoleName
    roleArn: process.env.OSS_ROLE_ARN,
    roleSessionName: "webUploadSession", // 自定义会话名称
  });

  try {
    const runtime = new RuntimeOptions({});
    const response = await client.assumeRoleWithOptions(assumeRoleRequest, runtime);
    return response.body.credentials; // 包含临时 AccessKeyId、AccessKeySecret、SecurityToken
  } catch (err) {
    console.error("Error in assumeRole: ", err);
    throw err;
  }
}

// ---------------------- 4. HMAC-SHA256 方法 ---------------------- //
function hmacsha256(key, data) {
  return crypto
    .createHmac("sha256", key)
    .update(data, "utf8")
    .digest();
}

function getOssObejctUrl(key) {
    return client.signatureUrl(key, { expires: 3600 })
}

module.exports = {
    parseCustomDateString,
    transformDate,
    generateExpiration,
    getCredential,
    hmacsha256,
    getOssObejctUrl
}