// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueHead from 'vue-head'
import VueCordova from 'vue-cordova'

import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(VueHead)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuetify,
  VueHead,
  VueCordova,
  components: { App },
  template: '<App/>'
})
