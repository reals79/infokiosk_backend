"use strict";

import Vue from 'vue';
import axios from "axios";

import router from "@/router";
import store from "@/store";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        config.headers.common['Authorization'] = 'Bearer ' + user.accessToken;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return new Promise(function (resolve, reject) {
      if (error.response.status === 401 && error.response.config && !error.response.config.__isRetryRequest) {
      // if you ever get an unauthorized, logout the user
        store.dispatch('auth/logout')
        router.push('/login').catch(() => { });
      }
      throw error;
    });
    //return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
