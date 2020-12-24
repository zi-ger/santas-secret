<template>
  <v-app id="inspire">

    <!-- app bar - big screens -->
    <v-app-bar class="hidden-sm-and-down" app color="white" flat>

      <v-row align="center">
        <v-col cols="2">
          <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        </v-col>
        
        <v-col cols="10">
          <v-container fill-height fluid>
            <v-layout row align-center>
              <img alt="Santa's Hat" class="justify-center" width="40" height="40" src="@/assets/logo.png" />
              <span class="text-h6 overline">Santa's Secret</span>
            
              <v-divider vertical class="mx-2"></v-divider>

              <v-btn text :to="{path: '/home'}">Home</v-btn>
              <v-btn text :to="{path: '/profile'}">Profile</v-btn>
              <v-btn text :to="{path: '/events'}">My Events</v-btn>
              <v-btn text :to="{path: '/new_event'}">New Event</v-btn>
              <v-btn text @click="logout">Logout</v-btn>
            </v-layout>
          </v-container>
        </v-col>
      </v-row>
    </v-app-bar>

    <!-- app bar - small screens -->
    <v-app-bar class="hidden-md-and-up" app color="white" flat>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="text-h6 overline">Santa's Secret</v-toolbar-title>
        <img alt="Santa's Hat" width="50" height="50" src="@/assets/logo.png" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>

        <br>

        <!-- Search form -->
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
      
        <v-divider class="my-2"></v-divider>

        <v-list-item-group v-model="group">
          
          <!-- Homepage item -->
          <v-list-item link :to="{path: '/home'}">
            <v-list-item-icon>
              <v-icon>mdi-home-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="overline">Homepage</v-list-item-title>
          </v-list-item>

          <!-- Profile item -->
          <v-list-item link :to="{path: '/profile'}">
            <v-list-item-icon>
              <v-icon>mdi-account-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="overline">Profile</v-list-item-title>
          </v-list-item>

          <!-- User events item -->
          <v-list-item link :to="{path: '/events'}">
            <v-list-item-icon>
              <v-icon>mdi-animation-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="overline">My Events</v-list-item-title>
          </v-list-item>

          <!-- New event item -->
          <v-list-item link :to="{path: '/new_event'}">
            <v-list-item-icon>
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="overline">New Event</v-list-item-title>
          </v-list-item>

          <v-divider class="my-5"></v-divider>

          <!-- Logout item -->
          <v-list-item link @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="overline">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Main container -->
    <v-main>
      <v-container class="grey lighten-3 fill-height" fluid>
        <v-row justify="center" class="fill-height">
          <v-col class="col-md-8 col-sm-12">
            <!-- Content Slot used to insert content in other views -->
            <slot name="content"></slot>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <span class="overline"><small>&copy; Ziger 2020</small></span>
    </v-footer>
  </v-app>
</template>

<script>
  import firebase from '@/database'

  export default {
    data: () => ({
      drawer: false,
      group: null,
      searchContent: ''
    }),
    methods: {
      logout: function () {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.$router.replace('login')
          })
      },
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