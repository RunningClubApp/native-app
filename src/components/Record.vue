<template>
  <div>
    <div id="map" :style="`width:${mapWidth}px;height:${mapHeight}px`">
    </div>
    <v-btn v-if="state===states.default" @click="StartRecord" class="fab" elevation="4" color="red" fixed right fab>
      <fa-icon icon="dot-circle"></fa-icon>
    </v-btn>
    <v-btn v-if="state===states.recording" @click="StopRecord" class="fab" elevation="4" color="red" fixed right fab>
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

export default {
  name: 'Record',
  data () {
    return {
      states: {
        default: 0,
        recording: 1,
        saving: 2
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
    console.log(this.mapWidth, this.mapHeight)
    this.CreateMap()
  },
  methods: {
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
            'line-opacity': 0.75,
            'line-width': 15
          }
        })

        navigator.geolocation.getCurrentPosition((data) => {
          this.map.panTo(new mapboxgl.LngLat(data.coords.longitude, data.coords.latitude))
        })
      })
    },
    StartRecord () {
      if (window.BackgroundGeolocation) {
        window.BackgroundGeolocation.onLocation(this.RecordPoint)
        window.BackgroundGeolocation.start()
          .then(() => {
            console.log('bgGEO started')
          })
      } else {
        this.watch = navigator.geolocation.watchPosition(this.RecordPoint)
      }
      this.state = this.states.recording
      console.log(this.state)
    },
    StopRecord () {
      if (window.BackgroundGeolocation) {
        window.BackgroundGeolocation.stop()
      } else {
        navigator.geolocation.clearWatch(this.watch)
      }
      this.state = this.states.saving
      this.modalOpen = true
    },
    DeleteRecording () {
      this.recordedPath = []
      this.state = this.states.default
    },
    SaveRecording () {
      this.state = this.states.default
    },
    RecordPoint (data) {
      console.log(data, this.state)
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
      this.map.panTo(new mapboxgl.LngLat(p.coords.lng, p.coords.lat))
      this.recordedPath.push(p)
      console.log('recorded point', p, this.recordedPath.length)

      const lineData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: this.recordedPath.map(x => [x.coords.lng, x.coords.lat])
        }
      }
      this.map.getSource('path').setData(lineData)
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
