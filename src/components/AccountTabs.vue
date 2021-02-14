<template>
  <v-bottom-navigation
    app
    dark
    v-model="value"
    color="primary"
    class="btm-nav"
    >

    <v-btn to="/account/signup">
      <span>Sign up</span>
      <fa-icon icon="user-plus"></fa-icon>
    </v-btn>

    <v-btn to="/account/login">
      <span>Log in</span>
      <fa-icon icon="sign-in-alt"></fa-icon>
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
