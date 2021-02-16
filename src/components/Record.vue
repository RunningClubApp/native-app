<template>
  <div>
    <div id="map" :style="`width:${mapWidth}px;height:${mapHeight}px`">
    </div>
    <v-btn v-if="state===states.ready" @click="StartRecord" class="fab" elevation="4" color="red" fixed right fab>
      <fa-icon icon="dot-circle"></fa-icon>
    </v-btn>
    <v-btn v-if="state===states.recording" @click="StopRecord" class="fab" elevation="4" color="red" fixed left fab>
      <fa-icon icon="stop"></fa-icon>
    </v-btn>
    <v-btn v-if="state===states.saving" @click="SaveRecording" class="fab" elevation="4" color="red" fixed right fab>
      <fa-icon icon="save"></fa-icon>
    </v-btn>
    <v-btn v-if="state===states.saving" @click="DeleteRecording" class="fab" elevation="4" color="red" fixed left fab>
      <fa-icon icon="trash"></fa-icon>
    </v-btn>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

import * as api from '../plugins/api'

export default {
  name: 'Record',
  data () {
    return {
      states: {
        default: 1,
        ready: 2,
        recording: 3,
        saving: 4
      },
      state: 0,
      accessToken: 'pk.eyJ1IjoidGVjcm9hc2RhbGUiLCJhIjoiY2thbnVsMXFvMGs1bjJzcGZtOWl2eTRkYiJ9.aAxvfikHkPZI4d2nf_m6AA', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/outdoors-v11', // your map style
      mapWidth: 0,
      mapHeight: 0,
      map: null,
      recordedPath: [],
      watch: null
    }
  },
  mounted () {
    this.mapWidth = window.innerWidth
    this.mapHeight = window.innerHeight
    console.log(JSON.stringify(this.mapWidth, this.mapHeight))
    this.CreateMap()
    this.ReadyGeo()
  },
  methods: {
    async ReadyGeo () {
      if (window.BackgroundGeolocation) {
        let state = await window.BackgroundGeolocation.getState()
        console.log('[state] ', state.enabled, state.trackingMode)
        if (state.enabled) {
          this.state = this.states.ready
          this.GetCurrentLocation()
          return
        }

        window.BackgroundGeolocation.onLocation(this.RecordPoint, this.onError)
        window.BackgroundGeolocation.ready({
          reset: true,
          // Geolocation Config
          desiredAccuracy: window.BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 5,
          // Activity Recognition
          stopTimeout: 5,
          // Application config
          debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
          logLevel: window.BackgroundGeolocation.LOG_LEVEL_VERBOSE,
          stopOnTerminate: true, // <-- Allow the background-service to continue tracking when user closes the app.
          startOnBoot: false, // <-- Auto start tracking when device is powered-up.
          notification: {
            title: 'Running club',
            text: 'Keep going!'
          },
          // HTTP / SQLite config
          url: undefined
        }, (state) => {
          console.log('- BackgroundGeolocation is configured and ready: ', state.enabled)
          console.log(JSON.stringify(state))
          if (!state.enabled) {
            // 3. Start tracking!
            window.BackgroundGeolocation.start()
              .then((state) => {
                console.log('bgGEO started - ', state)
              })
          }
          this.state = this.states.ready
          this.GetCurrentLocation()
        })
      } else {
        this.state = this.states.ready
        this.GetCurrentLocation()
      }
    },
    CreateMap () {
      mapboxgl.accessToken = this.accessToken
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.mapStyle, // stylesheet location
        center: [40, -74.5], // starting position [lng, lat]
        zoom: 16, // starting zoom,
        pitch: 35,
        minPitch: 35,
        maxPitch: 35,
        dragRotate: false,
        // dragPan: false,
        // scrollZoom: false,
        boxZoom: false,
        keyboard: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
        trackResize: true
      })

      this.map.on('load', () => {
        this.map.resize()
        this.map.addSource('path', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: [] }
          }
        })
        this.map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'path',
          'paint': {
            'line-color': 'red',
            'line-opacity': 1,
            'line-width': 15
          }
        })
      })
    },
    GetCurrentLocation () {
      if (window.BackgroundGeolocation) {
        window.BackgroundGeolocation.getCurrentPosition({
          timeout: 30, // 30 second timeout to fetch location
          maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
          desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
          samples: 3 // How many location samples to attempt.
        })
          .then((data) => {
            this.map.panTo(new mapboxgl.LngLat(data.coords.longitude, data.coords.latitude))
          })
      } else {
        navigator.geolocation.getCurrentPosition((data) => {
          this.map.panTo(new mapboxgl.LngLat(data.coords.longitude, data.coords.latitude))
        })
      }
    },
    onError (error) {
      console.warn('[location] ERROR -', JSON.stringify(error))
    },
    StartRecord () {
      if (window.BackgroundGeolocation) {
        window.BackgroundGeolocation.changePace(true)
          .then((data) => {
            console.log(data)
          })
      } else {
        this.watch = navigator.geolocation.watchPosition(this.RecordPoint)
      }
      this.state = this.states.recording
      console.log('>>> Starting Record')
    },
    StopRecord () {
      if (window.BackgroundGeolocation) {
        window.BackgroundGeolocation.stop()
      } else {
        navigator.geolocation.clearWatch(this.watch)
      }
      this.state = this.states.saving
      this.modalOpen = true
      this.ZoomMapToLine()
      console.log('>>> Stopping Record')
    },
    DeleteRecording () {
      this.recordedPath = []
      this.state = this.states.ready
    },
    SaveRecording () {
      this.state = this.states.ready
      if (this.recordedPath.length < 2) {
        this.$store.commit('createSnack', 'Path to short to save')
        return
      }
      const start = this.recordedPath[0].timestamp
      const end = this.recordedPath[this.recordedPath.length - 1].timestamp

      api.post(`exercise?s=${start}&e=${end}`, { path: this.recordedPath }, true)
        .then((data) => {
          console.log(data)
          if (data.success) {
            this.state = this.states.default
            this.recordedPath = []
            this.$router.push('/tabs/tabFeed')
            this.$store.commit('createSnack', 'Saved path!')
          } else {
            this.errors = data.errors
            console.log(this.errors)
            this.$store.commit('createSnack', 'Failed to save path')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    RecordPoint (data) {
      console.log(data, this.state)
      this.map.panTo(new mapboxgl.LngLat(data.coords.longitude, data.coords.latitude))
      if (this.state !== this.states.recording) {
        return
      }
      const p = {
        coords: {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        },
        elevation: data.coords.altitude | 0,
        timestamp: new Date(data.timestamp).toISOString()
      }
      this.recordedPath.push(p)
      console.log('recorded point', JSON.stringify(p), this.recordedPath.length)

      const lineData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: this.recordedPath.map(x => [x.coords.lng, x.coords.lat])
        }
      }
      this.map.getSource('path').setData(lineData)
    },
    ZoomMapToLine () {
      var coordinates = this.recordedPath.map(x => [x.coords.lng, x.coords.lat])
      if (coordinates.length < 2) {
        return
      }

      var bounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord)
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

      this.map.fitBounds(bounds, {
        padding: 35
      })
    }
  },
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css' }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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

#map {
  display: block;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}

.v-main {
  padding: 0 !important;
}

.map {
  grid-column: 1/-1;
  height: 100%;
  position: relative;
}

.map canvas, .map .mapboxgl-canvas {
  height: 100%;
}

</style>
