<template>
  <div>
    <!-- <br> -->
    <v-card  class="mx-auto" max-width="950">
      <v-card-title class="text-h5 overline"><img alt="Tree" height="50" src="@/assets/tree.png" />Matches</v-card-title>
      <v-card-subtitle class="overline">Create, view and find <b>Santa's Secret</b> matches.</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-btn :to="{path: '/home'}" class="my-1" block small>My matches</v-btn>
        <br>
        <v-btn :to="{path: '/match'}" class="my-1" block small>New match</v-btn>
        <br>
        <v-btn :to="{path: '/home'}" class="my-1" block small>Search</v-btn>
      </v-card-text>
    </v-card>    
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
