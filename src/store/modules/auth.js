const API_URL = "/api/auth/";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    }
  },
  actions: {
    login({ commit }, user) {
      return window.axios
        .post(API_URL + "login", user)
        .then(response => {
          if (!response.data.accessToken) {
            console.log("loginFailure");
            commit("loginFailure");
            return Promise.reject(response.data);
          }
          localStorage.setItem("user", JSON.stringify(response.data));
          commit("loginSuccess", response.data);
          return Promise.resolve(response.data);
        })
        .catch(error => {
          console.log("loginFailure");
          commit("loginFailure");
          return Promise.reject(error);
        });
    },
    logout({ commit }) {
      localStorage.removeItem("user");
      commit("logout");
    }
  },
  getters: {
    isAuthenticated: state => !!state.status.loggedIn
  }
};
