<template>
  <div class="overline">

    <v-row v-if="successAlert" align="center" justify="center">
      <v-col>
        <v-alert class="overline" :value="successAlert" type="success">
          Match saved.
        </v-alert>
        <br>
        <v-btn class="overline" color="secondary" block :to="{path: '/home'}">Go to home.</v-btn>
      </v-col>
    </v-row>

    <v-card v-if="!successAlert">
      <v-card-title>
        <v-icon x-large>mdi-plus-circle-outline</v-icon> <v-divider vertical class="mx-2"></v-divider><span class="text-h5">New match</span>
      </v-card-title>
      <v-card-subtitle>

      </v-card-subtitle>
      <br>
      <v-card-text>
        <v-form v-model="formValidation">
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

          <div v-for="(p, index) in match.participants" :key="p.id">

            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="10">
                <span class="text-subtitle-1 overline">Participant {{ index + 1 }}</span>
              </v-col>
              <!-- used to define dynamic id to participant -->
              <span hidden>{{ p.id = index }}</span> 
               <v-spacer></v-spacer> 
               <v-col cols="2">
                  <v-btn icon @click="match.participants.splice(index, 1)" ><v-icon>mdi-cancel</v-icon></v-btn>
               </v-col>
            </v-row>
            <v-row>
              <v-col cols="6"><v-text-field v-model="p.name" label="Name" required :rules="[v => !!v || 'Must provide participant name']"></v-text-field></v-col>
              <v-col cols="6"><v-text-field v-model="p.email" label="E-mail" required :rules="[v => !!v || 'Must provide participant email', v => /.+@.+\..+/.test(v) || 'Must provide a valid e-mail.']"></v-text-field></v-col>
            </v-row>
          </div>

          <v-btn class="overline" small block @click="newParticipant">Add participant</v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="cancelDialog = true">
          Cancel
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
        <v-divider class="mx-2" vertical></v-divider>
        <v-btn color="secondary" :disabled="!formValidation" @click="confirmDialog = true">
          Save
          <v-icon right>mdi-floppy</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- V-Dialog used to mimic JavaScript's confirm -->
    <v-dialog v-model="cancelDialog" persistent max-width="500">
      <v-card class="overline">
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

    <v-dialog v-model="confirmDialog" persistent max-width="500">
      <v-card class="overline">
        <v-card-title class="headline">Confirm match saving</v-card-title>
        <v-card-text>
          Are you sure you want to save this match?
          <v-spacer><br></v-spacer>
          Be sure that you provided valid e-mails.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="dark" link @click="save">Sure, save my match</v-btn>
          <v-btn color="dark" link @click="confirmDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from '@/database'
import emailjs from 'emailjs-com'

export default {
  data () {
    return {
      cancelDialog: false,
      confirmDialog: false,

      formValidation: true,

      successAlert: false,
  
      currentUser: {
        uid: '',
        name: '',
        last_name: ''
      },

      match: {
        name: '',
        budget: '',
        organizer_uid: '',
        participants: [],
        participants_sorted: []
      },
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
              userReference.email = doc.data().email
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
        id: '',
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
        if (pReference[i].id === pSorted[i].id) {
          isSorted = false;
          this.sortParticipants()
        }
      }

      // Only push to sorted list if condition - based in the for loop above - equals true
      if (isSorted === true) {
        this.match.participants_sorted = []
        for (let i = 0; i < pReference.length; i++) {
          this.match.participants_sorted.push({
            participant: {
              id: pReference[i].id,
              name: pReference[i].name,
              email: pReference[i].email, 
            },
            secret: {
              id: pSorted[i].id,
              name: pSorted[i].name,
              email: pSorted[i].email
            }
          })
        }
      }
    },

    // Init EmailJS
    initEmailJS() {
      emailjs.init(process.env.VUE_APP_EMAILJS_USER_ID)
    },

    // Send e-mails to users
    sendMails () {
      let matchReference = this.match
      let userReference = this.currentUser

      matchReference.participants_sorted.forEach(element => {

        let email_data = {
          to_name: element.participant.name,
          to_email: element.participant.email,

          secret_name: element.secret.name,
          secret_email: element.secret.email,

          organizer_name: userReference.name + ' ' + userReference.last_name,
          organizer_email: userReference.email,

          match_name: matchReference.name,
          budget: matchReference.budget,
        }

        emailjs.send("service_mail_ziger", "template_jluqp4k", email_data)
      })
    },

    // Save to database
    save () {
      let matchReference = this.match
      matchReference.organizer_uid = this.currentUser.uid

      this.confirmDialog = false

      this.sortParticipants()

      // saving this state
      let that = this

      firebase
        .firestore()
        .collection('matches')
        .add(matchReference)
        .then(function () {
          that.sendMails()
          that.successAlert = true
          setTimeout(() => {
            that.$router.replace('home')
          }, 3000)
        })
        .catch(function (error) {
          console.error('Error inserting item to database: ', error)
          this.dataDialog = true
        })
    }
  },
  created () {
    this.getUser()
    this.initEmailJS()
  }
}
</script>
