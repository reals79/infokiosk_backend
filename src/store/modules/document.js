const API_URL = "/api/admin/";

export const document = {
  namespaced: true,
  state: {
    data: []
  },
  mutations: {
    setData(state, payloads) {
      state.data = payloads;
    }
  },
  actions: {
    fetchData({ commit }) {
      return window.axios
        .get(API_URL + "document")
        .then(response => {
          let data = response.data;
          commit("setData", data);
          return Promise.resolve(data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    },
    storeData({ commit }, payloads) {
      return window.axios
        .post(API_URL + "document", payloads)
        .then(response => {
          let data = response.data;
          return Promise.resolve(data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    },
    updateData({ commit }, payloads) {
      let id = payloads.id;
      delete payloads.id;
      return window.axios
        .put(API_URL + "document/" + id, payloads)
        .then(response => {
          let data = response.data;
          return Promise.resolve(data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    },
    deleteData({ commit }, payloads) {
      return window.axios
        .delete(API_URL + "document/" + payloads.id)
        .then(response => {
          let data = response.data;
          return Promise.resolve(data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    },
    uploadDocumentFile({ commit }, payloads) {
      return window.axios
        .post(API_URL + "document/file", payloads, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
          let data = response.data;
          return Promise.resolve(data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
  },
  getters: {
    getData: state => state.data
  }
};
