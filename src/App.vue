<template>
  <v-app>
    <div v-if="isLoginView()">
      <router-view/>
    </div>
    <div v-else>
      <BaseLayout>
        <div slot="content">
          <router-view/>
        </div>
      </BaseLayout>
    </div>
  </v-app>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'

export default {
  name: 'App',
  components: {
    BaseLayout
  },
  methods: {
    // check if route path is Login
    isLoginView () {
      return (this.$route.path === '/login')
    }
  }
}
</script>
