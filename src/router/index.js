import firebase from '@/database'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'
import Profile from '@/views/Profile'

import NewEvent from '@/views/NewEvent'
import Events from '@/views/Events'
import Event from '@/views/Event'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/new_event',
    name: 'new_event',
    component: NewEvent,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/events',
    name: 'events',
    component: Events,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/event/:event_id',
    name: 'event',
    component: Event,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('home')
  else next()
})

export default router
