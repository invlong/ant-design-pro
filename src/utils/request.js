import fetch from 'dva/fetch';
import { notification } from 'antd';
import { HEADER_TYPE, getLocalStorage } from './utils';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // not login
  if (response.status === 401) {
    const error = new Error('用户未登录，请登录');
    error.response = response;
    throw error;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  // 添加token认证
  newOptions.headers = {
    Authorization: HEADER_TYPE + getLocalStorage('token'),
  };
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      throw error;
    });
}
