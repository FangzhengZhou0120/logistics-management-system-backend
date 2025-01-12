const axios = require('axios');
const https = require('https');
const crypto = require('crypto');

async function sinoiovHttpsCall(url, param) {
  // 1. 签名处理
  processParam(param);

  // 2. 将参数转换为 key=value&key=value 格式
  const reqBody = convertMapToString(param);
  console.log(`Request-url: ${url}, reqBody: ${reqBody}`);

  // 3. 根据 strict 决定是否跳过证书/域名校验
  //    (仅用于演示，生产环境必须开启校验)
  // const agentOptions = strict
  //   ? {}
  //   : {
  //       rejectUnauthorized: false,         // 不校验证书
  //       checkServerIdentity: () => void 0, // 不校验主机名 (可选)
  //     };
  // const httpsAgent = new https.Agent(agentOptions);

  // 4. 使用 axios 发送 POST 请求
  try {
    const response = await axios({
      method: 'POST',
      url,
      data: reqBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      //httpsAgent
    });

    // 响应成功
    console.log(`Response-code: ${response.status}, respBody: ${response.data}`);
    return response.data;
  } catch (err) {
    // axios 抛错时，信息通常在 err.response、err.message 中
    throw err;
  }
}

/**
 * 处理参数 - 对应 Java 代码的签名逻辑：
 * 1. 从 param 中提取 srt(私钥) 并删除
 * 2. 收集每个字段 "key + value"
 * 3. 排序
 * 4. 进行 HmacSHA1
 * 5. 转成 Hex 大写后放回 sign
 *
 * @param {object} param 
 */
function processParam(param) {
  if (!param.srt) {
    throw new Error('缺少 srt 参数');
  }
  const srt = param.srt;
  delete param.srt; // 私钥不提交到服务端

  // 收集 "key + value"
  const paramValueList = [];
  for (const [key, value] of Object.entries(param)) {
    paramValueList.push(key + value);
  }

  // 排序
  paramValueList.sort();

  // 计算 HmacSHA1
  const signature = hmacSha1(paramValueList, srt);

  // 转为 Hex 并大写
  param.sign = bufferToHex(signature).toUpperCase();
}

/**
 * 将对象转换成查询字符串：key=value&key=value
 * 
 * @param {object} param
 * @returns {string}
 */
function convertMapToString(param) {
  return Object.entries(param)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
}

/**
 * 计算 HmacSHA1 签名
 *
 * @param {string[]} dataArr 
 * @param {string} secretKey 
 * @returns {Buffer} 签名结果(二进制)
 */
function hmacSha1(dataArr, secretKey) {
  const hmac = crypto.createHmac('sha1', secretKey);
  for (const data of dataArr) {
    hmac.update(data, 'utf8');
  }
  return hmac.digest();
}

/**
 * 将 Buffer 转为十六进制字符串
 * @param {Buffer} buffer 
 * @returns {string}
 */
function bufferToHex(buffer) {
  return buffer.toString('hex');
}

module.exports = {
  sinoiovHttpsCall
}