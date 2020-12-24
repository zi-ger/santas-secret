<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title class="text-h5 overline"><img alt="Tree" height="40" src="@/assets/tree.png" /><v-divider vertical class="mx-2"></v-divider>Events</v-card-title>
      <v-card-subtitle class="overline">Create, view and find <b>Secret Santa</b> events</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-btn :to="{path: '/events'}" class="my-1" block small>My events</v-btn>
        <br>
        <v-btn :to="{path: '/new_event'}" class="my-1" block small>New event</v-btn>
        <br>
        <v-text-field
          v-model="searchContent"
          class="overline"
          append-outer-icon="mdi-magnify"
          outlined
          dense
          rounded
          clearable
          label="Search event"
          placeholder=" "
          type="text"
          @click:append-outer="search">
        </v-text-field>
      </v-card-text>
    </v-card>    
  </div>
</template>

<script>
import firebase from "@/database";

export default {
  data: () => ({
    searchContent: ''
  }),
  methods: {
      search: function () {
        let that = this

        firebase
          .firestore()
          .collection('events')
          .doc(that.searchContent)
          .get().then(function(doc) {
              if (doc.exists) {
                that.$router.push({ name: 'event', params: { event_id: that.searchContent } }).catch(function (c) {
                  alert(c)
                })
              } else {
                  alert("No event found.");
              }
          }).catch(function(error) {
              console.log("Error retrieving event data:", error);
          })
      }
  }
}
</script>
