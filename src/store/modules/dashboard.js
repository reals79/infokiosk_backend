const API_URL = "/api/admin/";

export const dashboard = {
  namespaced: true,
  state: {
    qtyQrCodes: 0,
    usedQrCodes: 0,
    qrcodes: []
  },
  mutations: {
    qrCodes(state, payloads) {
      state.qrcodes = payloads;
    },
    qtyQrCodes(state, payloads) {
      state.qtyQrCodes = payloads;
    },
    usedQrCodes(state, payloads) {
      state.usedQrCodes = payloads;
    }
  },
  actions: {
    fetchQrCodes({ commit }) {
      return window.axios
        .get(API_URL + "dashboard")
        .then(response => {
          let data = response.data;
          commit("qrCodes", data.qrcodes);
          commit("qtyQrCodes", data.qtyQrCodes);
          commit("usedQrCodes", data.usedQrCodes);
          return Promise.resolve(data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
  },
  getters: {
    qtyQrCodes: state => state.qtyQrCodes,
    usedQrCodes: state => state.usedQrCodes,
    qrcodes: state => state.qrcodes
  }
};
