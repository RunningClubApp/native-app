<template>
  <v-bottom-navigation
    app
    dark
    v-model="value"
    color="primary"
    class="btm-nav"
    >

    <v-btn to="/tabYou">
      <!-- <span>You</span> -->

      <fa-icon icon="user" size="2x"></fa-icon>
    </v-btn>

    <v-btn to="/tabFeed">
      <!-- <span>Feed</span> -->
      <fa-icon icon="newspaper" size="2x"></fa-icon>
    </v-btn>

    <v-btn to="/tabLeagues">
      <!-- <span>Leagues</span> -->
      <fa-icon icon="trophy" size="2x"></fa-icon>
    </v-btn>

    <v-btn to="/tabOptions">
      <!-- <span>Options</span> -->
      <fa-icon icon="cog" size="2x"></fa-icon>
    </v-btn>

  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'Tabs',
  data () {
    return {
      value: 'You'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btm-nav {
  z-index: 99
}

</style>
