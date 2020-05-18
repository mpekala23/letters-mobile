import axios from 'axios';
import url from 'url';

export const API_URL = 'http://localhost::somethinglater';
export const TRANSPORT = axios.create({ timeout: 10000 });

export function get(page, config = {}) {
  return new Promise((resolve, reject) => {
    TRANSPORT.get(url.resolve(API_URL, page), config).then((result) => {
      resolve(result.data);
    }, reject);
  });
}

export function post(page, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    TRANSPORT.post(url.resolve(API_URL, page), data, config).then((result) => {
      resolve(result.data);
    }, reject);
  });
}
