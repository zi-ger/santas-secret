<template>
  <div>
    <v-card cols="12" class="my-5">
      <v-card-title class="overline text-h5">{{ event.name }}</v-card-title>
      <v-card-subtitle class="overline"><b>Organizer:</b> {{ organizer_name }}<br><b>Participants:</b> {{ event.participants.length }}<br><b>Budget:</b> {{ event.budget }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-row align="center" justify="center">
          <span class="overline text-h6">Participant list</span>
        </v-row>
        <v-list two-line subheader>
          <v-list-item v-for="p in event.participants" :key="p.id">
            <v-list-item-content class="overline">
              <v-list-item-title>{{ p.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ p.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
</div>
</template>

<script>
import firebase from '@/database'

export default {
  data: () => ({
    event: {
      participants: []
    },
    organizer_name: ''
  }),

  methods: {
    // Get event using router param and organizer name
    async getData () {
      let that = this
      
      await firebase
        .firestore()
        .collection('events')
        .doc(this.$route.params.event_id)
        .get()
        .then(function (doc) {
          that.event = doc.data()
        })
      
      await firebase
        .firestore()
        .collection('users')
        .doc(this.event.organizer_uid)
        .get().then(function(doc) {
            that.organizer_name = doc.data().name + ' ' + doc.data().last_name
        })  
    }
  },
  created () {
    this.getData()
  },
}
</script>
