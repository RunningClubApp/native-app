<template>
  <div>
    <v-text-field
      v-model="signupDetails.email"
      :rules="emailRules"
      label="Email"
      required
      >
      </v-text-field>
    <v-text-field
      v-model="signupDetails.password"
      type="password"
      :rules="nameRules"
      label="Password"
      required
      >
      </v-text-field>

      <v-btn
        block
        color="primary"
        elevation="1"
        large
      >Log in</v-btn>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      signupDetails: {
        name: '',
        password: ''
      }
    }
  },
  computed: {
    nameRules () {
      return [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters'
      ]
    },
    emailRules () {
      return [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
