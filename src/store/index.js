import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snack: undefined
  },
  mutations: {
    createSnack (state, text) {
      state.snack = {
        text
      }
    },
    rmSnack (state) {
      state.snack = undefined
    }
  }
})
