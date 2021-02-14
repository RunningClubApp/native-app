<template>
  <div>
    <v-text-field
      v-model="loginDetails.email"
      :rules="emailRules"
      label="Email"
      required
      >
      </v-text-field>
    <v-text-field
      v-model="loginDetails.password"
      type="password"
      :rules="passRules"
      label="Password"
      required
      >
      </v-text-field>

      <v-btn
        @click="loginToAccount"
        block
        color="primary"
        elevation="1"
        large
      >Log in</v-btn>
  </div>
</template>

<script>
import * as api from '../plugins/api'
import { setUserToken } from '../plugins/userstore'

export default {
  name: 'Login',
  data () {
    return {
      loginDetails: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    passRules () {
      return [
        v => !!v || 'Password is required'
      ]
    },
    emailRules () {
      return [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    loginToAccount () {
      api.post('auth/login', this.loginDetails, false)
        .then((data) => {
          if (data.success) {
            setUserToken(data.token.token)
            this.$router.push({ name: 'Feed' })
          } else {
            console.log(data)
            this.errors = data.errors
            console.log(this.errors)
          }
        })
        .catch((e) => {
          console.log(e)
        })
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
