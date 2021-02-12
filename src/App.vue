<template>
  <v-app id="app">
    <v-app-bar app dense dark>
      <v-toolbar-title>Page title</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
        <v-btn to="/tabRecord" class="mx-2 fab" elevation="2" href="#" color="red" fixed right fab>
          <fa-icon icon="dot-circle"></fa-icon>
        </v-btn>
      </v-container>
    </v-main>
    <Tabs></Tabs>
  </v-app>
</template>

<script>
import Tabs from './components/Tabs'
export default {
  name: 'App',
  components: { Tabs }
}
</script>

<style>
.fab {
  bottom: 80px;
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
