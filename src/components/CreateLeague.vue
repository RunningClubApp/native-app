<template>
  <v-form>
    <v-text-field
      v-model="leagueDetails.name"
      label="League Title"
    ></v-text-field>
    <v-select
      :items="lengths"
      label="League Length"
      v-model="leagueDetails.length"
    ></v-select>

    <v-btn
        @click="CreateLeague"
        block
        color="primary"
        elevation="1"
        large
      >Create League</v-btn>
  </v-form>
</template>

<script>
import * as api from '../plugins/api'

export default {
  name: 'CreateLeague',
  data () {
    return {
      lengths: [ 'Weekly', 'Monthly', 'Quaterly', 'Yearly' ],
      leagueDetails: {
        name: '',
        length: 'Weekly'
      }
    }
  },
  mounted () {
    
  },
  methods: {
    CreateLeague () {
      this.errors = {}
      console.log(this.leagueDetails)
      api.post(`leagues?ti=${this.leagueDetails.name}&l=${this.leagueDetails.length}`, {}, true)
        .then((data) => {
          if (data.success) {
            this.$router.push('/')
          } else {
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
.fab {
  z-index: 100 !important;
  bottom: 80px;
}
</style>
