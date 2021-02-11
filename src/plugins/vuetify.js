// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

Vue.component('fa-icon', FontAwesomeIcon)
library.add(fas)

Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'faSvg'
  }
}

export default new Vuetify(opts)
