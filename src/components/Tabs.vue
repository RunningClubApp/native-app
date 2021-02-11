<template>
  <v-bottom-navigation
    app
    fixed
    grow
    v-model="tab"
    color="primary"
    >

    <v-btn value="You">
      <span>You</span>
      <fa-icon icon="user"></fa-icon>
    </v-btn>

    <v-btn disabled href="#">
      <span>Feed</span>
      <fa-icon icon="newspaper"></fa-icon>
    </v-btn>
    
    <v-btn href="#">
      <span>Leagues</span>
      <fa-icon icon="trophy"></fa-icon>
    </v-btn>

    <v-btn disabled href="#">
      <span>Options</span>
      <fa-icon icon="cog"></fa-icon>
    </v-btn>

  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'Tabs',
  data () {
    return {
      text: '',
      tab: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
