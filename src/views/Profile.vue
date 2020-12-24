<template>
  <div class="overline">
    <v-alert :value="successAlert" type="success">
      Profile updated.
    </v-alert>

    <v-card>
      <v-card-title>
        <v-icon x-large>mdi-account-cog-outline</v-icon> <v-divider vertical class="mx-2"></v-divider><span class="text-h5 overline">Profile</span>
      </v-card-title>
      <br>
      <v-card-text>
        <v-container grid-list-md>
          <v-text-field
            v-model="currentUser.email"
            disabled
            label="E-mail">
          </v-text-field>

          <v-text-field
            v-model="profile.name"
            label="Name"
            required
            :rules="[v => !!v || 'Must provide name']">
          </v-text-field>

          <v-text-field
            v-model="profile.last_name"
            label="Last Name"
            required
            :rules="[v => !!v || 'Must provide last name']">
          </v-text-field>

          <v-menu
            v-model="birth_menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="profile.birth"
                label="Birth"
                readonly
                v-on="on">
              </v-text-field>
            </template>
            <v-date-picker v-model="profile.birth" @input="birth_menu = false" color="primary"></v-date-picker>
          </v-menu>
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
      successAlert: false,
      cancelDialog: false,

      currentUser: {},

      birth_menu: false,

      profile: {
        uid: '',
        name: '',
        last_name: '',
        birth: ''
      }
    }
  },
  methods: {
    // Retrieves user information
    async getUser () {
      var localProfile = this.profile
      this.currentUser = firebase.auth().currentUser

      setTimeout(() => {
        firebase
        .firestore()
        .collection('users')
        .doc(this.currentUser.uid)
        .get().then(function(doc) {
            if (doc.exists) {
              localProfile.uid = doc.id
              localProfile.name = doc.data().name
              localProfile.last_name = doc.data().last_name

              if (doc.data().birth === '' || doc.data().birth === undefined) {
                localProfile.birth = doc.data().birth
              } else {
                localProfile.birth = new Date(doc.data().birth.seconds * 1000).toISOString().substr(0, 10)
              }
              
            } else {
                console.log("No such user data.");
            }
        }).catch(function(error) {
            console.log("Error retrieving user data:", error);
        })
      }, 500)

    },

    // Updates user information
    save () {
      var localProfile = this.profile

      var profileUpdate = {
        name: localProfile.name,
        last_name: localProfile.last_name,
      }

      if (localProfile === '' || localProfile === undefined) {
        profileUpdate.birth = ''
      } else {
        profileUpdate.birth = firebase.firestore.Timestamp.fromDate(new Date(localProfile.birth.replace(/-/g, '/')))
      }

      firebase
        .firestore()
        .collection('users')
        .doc(localProfile.uid)
        .update(profileUpdate)
        .then()
        .catch(function (error) {
          console.error('Error saving user profile: ', error)
        })
      
      this.successAlert = true
      setTimeout(() => {
        this.successAlert = false
        this.$router.replace('home')
      }, 3000)
    }
  },
  created () {
    this.getUser()
  }
}
</script>
