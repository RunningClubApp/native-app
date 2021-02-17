import Vue from 'vue'
import Router from 'vue-router'
import You from '@/components/You'
import Leagues from '@/components/Leagues'
import CreateLeague from '@/components/CreateLeague'
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
      name: 'Sign Up',
      component: Signup,
      meta: {
        guestAllowed: true,
        tabs: 'account',
        showRecordBtn: false
      }
    },
    {
      path: '/account/login',
      name: 'Log In',
      component: Login,
      meta: {
        guestAllowed: true,
        tabs: 'account',
        showRecordBtn: false
      }
    },
    {
      path: '/tabYou',
      name: 'You',
      component: You
    },
    {
      path: '/tabFeed',
      name: 'Feed',
      component: Feed
    },
    {
      path: '/tabLeagues',
      name: 'Leagues',
      component: Leagues,
    },
    {
      path: '/tabLeagues/create',
      name: 'Create League',
      component: CreateLeague
    },
    {
      path: '/tabOptions',
      name: 'Options',
      component: Options
    },
    {
      path: '/tabRecord',
      name: 'Record',
      component: Record
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const uToken = await getUserToken()
  console.log(uToken, to.matched)
  if (to.matched.some(record => record.meta.guestAllowed)) {
    next()
  } else {
    if (uToken === null || uToken === undefined) {
      next({
        name: 'Sign Up'
      })
    } else {
      next()
    }
  }
})

export default router
