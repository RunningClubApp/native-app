import Vue from 'vue'
import Router from 'vue-router'
import You from '@/components/You'
import Leagues from '@/components/Leagues'
import Record from '@/components/Record'
import Feed from '@/components/Feed'
import Options from '@/components/Options'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/tabYou',
      name: 'TabYou',
      component: You
    },
    {
      path: '/tabFeed',
      name: 'TabFeed',
      component: Feed
    },
    {
      path: '/tabLeagues',
      name: 'TabLeagues',
      component: Leagues
    },
    {
      path: '/tabOptions',
      name: 'TabOptions',
      component: Options
    },
    {
      path: '/tabRecord',
      name: 'TabRecord',
      component: Record
    }
  ]
})
