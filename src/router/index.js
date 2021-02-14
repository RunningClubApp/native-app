import Vue from 'vue'
import Router from 'vue-router'
import You from '@/components/You'
import Leagues from '@/components/Leagues'
import Record from '@/components/Record'
import Feed from '@/components/Feed'
import Options from '@/components/Options'
import Signup from '@/components/Signup'
import Login from '@/components/Login'

import { getUserToken } from '../plugins/userstore'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/account/signup',
      name: 'SignUp',
      component: Signup,
      meta: {
        guestAllowed: true,
        tabs: 'account',
        showRecordBtn: false
      }
    },
    {
      path: '/account/login',
      name: 'LogIn',
      component: Login,
      meta: {
        guestAllowed: true,
        tabs: 'account',
        showRecordBtn: false
      }
    },
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

router.beforeEach(async (to, from, next) => {
  const uToken = await getUserToken()
  console.log(to.matched)
  if (to.matched.some(record => record.meta.guestAllowed)) {
    next()
  } else {
    if (uToken === null || uToken === undefined) {
      next({
        path: '/account/signup'
      })
    } else {
      next()
    }
  }
})

export default router
