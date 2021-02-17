<template>
  <v-app id="app">
    <v-app-bar app dense dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
    <v-main style="padding: 0;">
      <v-container>
        <router-view />
        <div v-if="showRecordBtn" class="center-btn-container">
          <v-btn to="/tabRecord" class="center-btn" elevation="2" href="#" color="red" fab>
            <fa-icon icon="dot-circle"></fa-icon>
          </v-btn>
        </div>
      </v-container>
    </v-main>
    <AccountTabs v-if="tabs==='account'"></AccountTabs>
    <Tabs v-else></Tabs>

    <v-snackbar
      v-model="snackbar"
    >
      {{ snackText }}

      <v-btn
        color="pink"
        text
        @click="closeSnack"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Tabs from './components/Tabs'
import AccountTabs from './components/AccountTabs'

export default {
  name: 'App',
  components: { Tabs, AccountTabs },
  data () {
    return {
      tabs: 'default',
      showRecordBtn: true,
      title: ''
    }
  },
  mounted () {
    this.updateNavs()
  },
  watch: {
    $route (to, from) {
      this.updateNavs()
    }
  },
  computed: {
    snackbar () {
      return this.$store.state.snack !== undefined
    },
    snackText () {
      if (this.$store.state.snack !== undefined) {
        return this.$store.state.snack.text
      }
      return ''
    }
  },
  methods: {
    updateNavs () {
      this.showRecordBtn = this.$route.meta.showRecordBtn === undefined ? true : this.$route.meta.showRecordBtn
      this.tabs = this.$route.meta.tabs === undefined ? 'default' : this.$route.meta.tabs
      this.title = this.$route.name
    },
    closeSnack () {
      this.$store.commit('rmSnack')
    }
  }
}
</script>

<style>
.center-btn-container {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 30;
  height: 56px;
  z-index: 100 !important;
}

.center-btn {
  display: block;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
