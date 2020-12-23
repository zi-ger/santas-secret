<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="text-h5 overline">New match</span>
      </v-card-title>
      <br>
      <v-card-text>
        <v-container grid-list-md>
          <v-text-field
            v-model="match.name"
            label="Name"
            required
            :rules="[v => !!v || 'Must provide match name.']">
          </v-text-field>

          <v-text-field
            v-model="match.budget"
            label="Budget"
            prefix="$"
            required
            :rules="[v => /^\d+$/.test(v) || 'Must provide a valid number.', v => !!v || 'Must provide budget.']">
          </v-text-field>

          <div v-for="(p, index) in match.participants" :key="index">

            <v-divider class="my-3"></v-divider>
            <span class="text-subtitle-1 overline">Participant {{ index+1 }}</span>
            <v-row >
              <v-col cols="6"><v-text-field v-model="p.name" label="Name" required :rules="[v => !!v || 'Must provide participant name']"></v-text-field></v-col>
              <v-col cols="6"><v-text-field v-model="p.email" label="E-mail" required :rules="[v => !!v || 'Must provide participant email', v => /.+@.+\..+/.test(v) || 'Must provide a valid e-mail.']"></v-text-field></v-col>
            </v-row>
          </div>

          <v-btn class="overline" small block @click="newParticipant">Add participant</v-btn>
          <v-btn class="overline" small block @click="sortParticipants">Sort participants</v-btn>

          <p v-for="(p, name) in match.participants_sorted" :key="name">
            {{p.name}} - {{p.secret}}
          </p>

        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="cancelDialog = true">
          Cancel
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
        <v-divider class="mx-2" vertical></v-divider>
        <v-btn color="secondary" @click="save">
          Save
          <v-icon right>mdi-floppy</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- V-Dialog used to mimic JavaScript's confirm -->
    <v-dialog v-model="cancelDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">Cancel changes</v-card-title>
        <v-card-text>
          Are you sure you want to cancel?
          <v-spacer><br></v-spacer>
          Any unsaved data will be lost.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="dark" link :to="{path: '/home'}">Sure, cancel changes</v-btn>
          <v-btn color="dark" link @click="cancelDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from '@/database'

export default {
  data () {
    return {
      cancelDialog: false,
  
      currentUser: {
        uid: '',
        name: '',
        last_name: ''
      },

      match: {
        name: '',
        budget: '',
        participants: [],
        participants_sorted: []
      }
    }
  },
  methods: {
    // Get user information
    getUser () {
      let userReference = this.currentUser

        firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get().then(function(doc) {
            if (doc.exists) {
              userReference.uid = doc.id
              userReference.name = doc.data().name
              userReference.last_name = doc.data().last_name
            } else {
                console.log("No such user data.");
            }
        }).catch(function(error) {
            console.log("Error retrieving user data:", error);
        })
    },

    // Add new participant 
    newParticipant () {
      this.match.participants.push({
        name: '',
        email: ''
      })
    },

    // Sort participants
    sortParticipants () {
      this.match.participants_sorted = []
      let pReference = this.match.participants
      let pSorted = pReference.slice(0)

      for (let i = pSorted.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = pSorted[i]
        pSorted[i] = pSorted[j]
        pSorted[j] = temp
      }
      
      let isSorted = true;

      // Redo sorting if participant position is the same in sorted list
      for (let i = 0; i < pReference.length; i++) {
        if (pReference[i].name === pSorted[i].name) {
          isSorted = false;
          this.sortParticipants()
        }
      }

      // Only push to sorted list if condition - based in the for loop above - equals true
      if (isSorted === true) {
        for (let i = 0; i < pReference.length; i++) {
          let ps = {
            name: pReference[i].name,
            email: pReference[i].email,
            secret: pSorted[i].email
          }
          this.match.participants_sorted.push(ps)
        }
      }

      
    },

    // Save to database
    save () {
      let matchReference = this.match
      let userReference = this.currentUser

      matchReference.user_uid = userReference.uid

      firebase
        .firestore()
        .collection('matches')
        .add(matchReference)
        .catch(function (error) {
          console.error('Error inserting item to database: ', error)
          this.dataDialog = true
        })

    }
  },
  created () {
    this.getUser()
  }
}
</script>
