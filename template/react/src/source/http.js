import XHR from "xhr";
import { getLocal, setLocal } from "./storage";

const formatOptions = ({
  method,
  url,
  json = {},
  headers = {},
  form = null,
  responseType = "json",
  body = null,
}) => {
  const options = {
    url,
    method,
    responseType,
  };

  if (!form) {
    headers["Content-Type"] = "application/json";
    options["headers"] = headers;

    if (!body) {
      const params = {};
      for (let prop in json) {
        if (json[prop] === "" || json[prop] === null) continue;

        params[prop] = json[prop];
      }

      options["json"] = params;
    } else {
      options["data"] = JSON.stringify(body);
    }
  } else {
    // form 表单传输
    const formData = new FormData();
    for (let prop in form) {
      formData.append(prop, form[prop]);
    }
    options["data"] = formData;
  }

  return options;
};

/**
 * 公共请求
 *
 * @param options
 */
export const request = (options) => {
  if (!options.url) throw new Error("缺少请求 url");

  return new Promise((resolve, reject) => {
    XHR(formatOptions(options), function (err, resp, body) {
      if (!err && resp.statusCode === 200) {
        // 增加跳转逻辑
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};

/**
 * 缓存接口数据
 *
 * @param {*} options
 * @param {*} delay 单位 分钟
 */
export const requestLocal = function (options, delay) {
  return new Promise((resolve, reject) => {
    const key = options.url;

    delay = +delay > 0 ? delay : 1;

    const value = getLocal(key);

    if (value && Date.now() - value.timestamp < delay * 60000) {
      resolve(value.data);
    } else {
      request(options)
        .then((res) => {
          setLocal(key, { timestamp: Date.now(), data: res });
          resolve(res);
        })
        .then((err) => reject(err));
    }
  });
};
