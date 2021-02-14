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
      v-model="signupDetails.name"
      :rules="nameRules"
      label="Name"
      required
      >
      </v-text-field>
    <v-text-field
      v-model="signupDetails.password"
      type="password"
      :rules="passRules"
      label="Password"
      required
      >
      </v-text-field>
    <v-text-field
      v-model="signupDetails.confirmPassword"
      type="password"
      :rules="passRules"
      label="Confirm Password"
      required
      >
      </v-text-field>

      <v-btn
        block
        color="primary"
        elevation="1"
        large
        @click="createUserAccount"
      >Create account</v-btn>
  </div>
</template>

<script>
import * as api from '../plugins/api'
import { setUserToken } from '../plugins/userstore'

export default {
  name: 'Signup',
  data () {
    return {
      signupDetails: {
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
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
    passRules () {
      return [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Name must be at least 8 characters'
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
    createUserAccount () {
      api.post('auth', this.signupDetails, false)
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
