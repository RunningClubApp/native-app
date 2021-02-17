<template>
  <div>
    <v-card v-for="league in leagues" :key="league._id" rounded outlined elevation="0">
      <v-card-title>
        {{ league.title }}
      </v-card-title>
      <v-card-text>
        <v-list-item v-for="(item, placement) in league.participants" :key="placement">
          <v-list-item-icon>
            #{{ placement + 1 }}
          </v-list-item-icon>
          <v-list-item-content>
          {{ item.name }}
          </v-list-item-content>
          <v-list-item-icon>
            <span v-if="league.userDists">{{ (league.userDists[item._id] / 1000).toFixed(2) }}km</span>
            <v-progress-circular class="ml-3" :size="25" indeterminate v-else />
          </v-list-item-icon>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-btn @click="routeToCreate" class="fab" elevation="4" color="red" fixed right fab>
      <fa-icon icon="plus"></fa-icon>
    </v-btn>
  </div>
</template>

<script>
import * as api from '../plugins/api'

export default {
  name: 'Leagues',
  data () {
    return {
      leagues: []
    }
  },
  mounted () {
    this.FetchLeagues()
  },
  methods: {
    routeToCreate () {
      this.$router.push('/tabLeagues/create')
    },
    FetchLeagues () {
      api.get('leagues/foruser', true)
        .then((data) => {
          console.log(data)
          if (data.success) {
            this.leagues = data.leagues
            this.leagues.forEach((league) => {
              this.FetchAllUserDistances(league)
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async FetchAllUserDistances (league) {
      // const newLeagues = []
      // for (const league of leagues) {
      const s = new Date(league.league_start)

      const e = new Date(s)
      const days = ({'Weekly': 7, 'Monthly': 30, 'Quarterly': 90, 'Yearly': 365})[league.league_length]
      e.setDate(e.getDate() + days)
      const userDists = {}

      for (const u of league.participants) {
        if (!userDists[u._id]) {
          const dist = await this.FetchUserDist(u._id, s, e)
          userDists[u._id] = dist
          console.log(u._id, dist)
        }
      }

      league.userDists = userDists
      league.participants = league.participants.sort((a, b) => {
        return league.userDists[b._id] - league.userDists[a._id]
      })
      // newLeagues.push(league)
      // }
      // this.leagues = newLeagues
      // console.log(this.leagues)
    },
    async FetchUserDist (uid, s, e) {
      return new Promise((resolve, reject) => {
        api.get(`exercise/userdistance?uid=${uid}&s=${s.toISOString()}&e=${e.toISOString()}`, false)
          .then((data) => {
            resolve(data.success ? data.distance : 0)
          }).catch((e) => {
            resolve(0)
            console.log(e)
          })
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
