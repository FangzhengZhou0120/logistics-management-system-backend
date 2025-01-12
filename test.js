/*******************************************************
 * kfpt-demo.js
 *
 * 使用 axios 简化了发起 HTTPS 请求的过程。
 * 与 Java 代码逻辑对应：
 *  1. 处理参数：HmacSHA1 加签
 *  2. 拼装请求体
 *  3. (非严格模式时) 跳过证书校验
 *  4. 发送 POST 请求并获取响应
 *******************************************************/

const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const { start } = require('repl');

/** 
 * 入口函数 - 模拟 main()
 */
(async function main() {
  try {
    // 1. 基础 URL
    const baseUrl = 'https://openapi-test.sinoiov.cn/save/apis/';

    // 2. 拼接接口地址
    const vLastLocationV3Url = baseUrl + 'routerPath';

    // 3. 组装请求参数
    const vLastLocationParam = {
      // 客户端ID
      cid: 'b8337154-123b-45bd-85f3-bc30f6d4c2aa',

      // 私钥
      srt: '39bcc18f-dcaa-4b24-a27f-0f7351f8d215',

      // 业务参数
      vclN: "陕YH8888",
      vco: "2",
      qryBtm: "2025-01-10 00:00:00",
      qryEtm: "2025-01-11 22:59:59",
    };

    // 4. 发起请求（第三个参数 strict=false 表示不进行严格校验）
    const vLastLocationV3Result = await httpsCall(vLastLocationV3Url, vLastLocationParam, false);

    // 5. 打印结果
    console.log('响应结果：', vLastLocationV3Result);
  } catch (err) {
    console.error('调用异常：', err);
  }
})();

/**
 * 使用 axios 发送 HTTPS 请求。
 * 与 Java 原示例对应的核心逻辑：
 * 1. 处理参数：计算签名并加入 sign
 * 2. 将参数拼装为查询字符串
 * 3. 非严格模式下跳过证书校验
 * 4. 发起 POST 请求并获取响应
 *
 * @param {string} url   请求地址
 * @param {object} param 请求参数
 * @param {boolean} strict 是否严格校验证书
 * @returns {Promise<string>} 响应字符串
 */
async function httpsCall(url, param, strict) {
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
      // httpsAgent
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
