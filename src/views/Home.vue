<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title class="text-h5 overline"><img alt="Tree" height="40" src="@/assets/tree.png" /><v-divider vertical class="mx-2"></v-divider>Matches</v-card-title>
      <v-card-subtitle class="overline">Create, view and find <b>Secret Santa</b> matches</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-btn :to="{path: '/matches'}" class="my-1" block small>My matches</v-btn>
        <br>
        <v-btn :to="{path: '/new_match'}" class="my-1" block small>New match</v-btn>
        <br>
        <v-text-field
          v-model="searchContent"
          class="overline"
          append-outer-icon="mdi-magnify"
          outlined
          dense
          rounded
          clearable
          label="Search match"
          placeholder=" "
          type="text"
          @click:append-outer="search">
        </v-text-field>
        <!-- <v-btn :to="{path: '/home'}" class="my-1" block small>Search</v-btn> -->
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
          .collection('matches')
          .doc(that.searchContent)
          .get().then(function(doc) {
              if (doc.exists) {
                that.$router.push({ name: 'match', params: { match_id: that.searchContent } }).catch(function (c) {
                  alert(c)
                })
              } else {
                  alert("No match found.");
              }
          }).catch(function(error) {
              console.log("Error retrieving match data:", error);
          })
      }
  }
}
</script>
