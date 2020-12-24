<template>
  <div>
    <v-card class="overline">
      <v-card-title>
        <v-icon x-large>mdi-animation-outline</v-icon><v-divider vertical class="mx-2"></v-divider><span class="text-h5">Events</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle v-if="events.length === 0">No events found for your account.</v-card-subtitle>
      <v-card-subtitle v-else-if="events.length === 1">Displaying 1 event.</v-card-subtitle>
      <v-card-subtitle v-else>Displaying {{ events.length }} events.</v-card-subtitle>
    </v-card>

    <v-card class="overline my-5" v-for="(event, i) in events" :key="i" cols="12">
      <v-card-title class="text-h6">{{ event.name }}</v-card-title>
      <v-card-subtitle>Participants: {{ event.participants.length }}<br>Budget: {{ event.budget }}</v-card-subtitle>
      <v-card-actions>
        <v-btn block outlined rounded :to="{ name: 'event', params: { event_id: event.id } }">Go to event</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import firebase from '@/database'

export default {
  data: () => ({
    events: []
  }),

  methods: {
    // Used to get all events linked to user.
    async getData () {
      let that = this

      firebase
        .firestore()
        .collection('events')
        .where('organizer_uid', '==', firebase.auth().currentUser.uid)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            let event = doc.data()
            event.id = doc.id
            that.events.push(event)
          })
        })
    }
  },
  created () {
    this.getData()
  },
}
</script>
