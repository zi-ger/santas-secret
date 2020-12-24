<template>
  <div>

    <v-card class="overline">
      <v-card-title>
        <v-icon x-large>mdi-animation-outline</v-icon><v-divider vertical class="mx-2"></v-divider><span class="text-h5">Matches</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle v-if="matches.length === 0">No matches found for your account.</v-card-subtitle>
      <v-card-subtitle v-else-if="matces.length === 1">Displaying 1 match.</v-card-subtitle>
      <v-card-subtitle v-else>Displaying {{ matches.length }} matches.</v-card-subtitle>
    </v-card>

    <v-card class="overline my-5" v-for="(match, i) in matches" :key="i" cols="12">
      <v-card-title class="text-h6">{{ match.name }}</v-card-title>
      <v-card-subtitle>Participants: {{ match.participants.length }}<br>Budget:</v-card-subtitle>
      <v-card-actions>
        <v-btn block outlined rounded :to="{ name: 'match', params: { match_id: match.id } }">Go to match.</v-btn>
      </v-card-actions>
    </v-card>
</div>
</template>

<script>
import firebase from '@/database'

export default {
  data: () => ({
    matches: []
  }),

  methods: {
    // Used to get all matches linked to user.
    async getData () {
      let that = this

      firebase
        .firestore()
        .collection('matches')
        .where('organizer_uid', '==', firebase.auth().currentUser.uid)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            let match = doc.data()
            match.id = doc.id
            that.matches.push(match)
          })
        })
    }
  },
  created () {
    this.getData()
  },
}
</script>

<style>

</style>