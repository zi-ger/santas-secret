<template>
  <v-app id="inspire">

    <!-- app bar - big screens -->
    <v-app-bar class="hidden-sm-and-down" app color="white" flat>

      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-container class="py-0 fill-height">
        <v-btn text :to="{path: '/'}">
          <img alt="Santa's Hat" width="50" height="50" src="@/assets/logo.png" />
          <span class="text-h6 overline">Santa's Secret</span>
        </v-btn>  

        <v-divider vertical class="mx-7"></v-divider>

        <v-btn text :to="{path: '/profile'}">Profile</v-btn>
        <v-btn text :to="{path: '/matches'}">My Matches</v-btn>
        <v-btn text :to="{path: '/new_match'}">New Match</v-btn>
        <v-btn text @click="logout">Logout</v-btn>

      </v-container>
    </v-app-bar>

    <!-- app bar - small screens -->
    <v-app-bar class="hidden-md-and-up" app color="white" flat>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn text :to="{path: '/'}">
          <v-toolbar-title class="text-h6 overline">Santa's Secret</v-toolbar-title>
          <img alt="Santa's Hat" width="50" height="50" src="@/assets/logo.png" />
        </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>

        <!-- Search form -->
        <!-- <v-form>
          <v-text-field
            v-model="searchContent"
            append-outer-icon="mdi-magnify"
            filled
            flat
            rounded
            label="Search match"
            type="text"
            @click:append-outer="search">
          </v-text-field>
        </v-form> -->

        <v-divider class="my-3"></v-divider>


        <v-list-item-group v-model="group">

          <!-- Homepage item -->
          <v-list-item link :to="{path: '/'}">
            <v-list-item-icon>
              <v-icon>mdi-home-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Homepage</v-list-item-title>
          </v-list-item>

          <!-- Profile item -->
          <v-list-item link :to="{path: '/profile'}">
            <v-list-item-icon>
              <v-icon>mdi-account-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <!-- User matches item -->
          <v-list-item link :to="{path: '/matches'}">
            <v-list-item-icon>
              <v-icon>mdi-animation-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Matches</v-list-item-title>
          </v-list-item>

          <!-- New match item -->
          <v-list-item link :to="{path: '/new_match'}">
            <v-list-item-icon>
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>New Match</v-list-item-title>
          </v-list-item>

          <v-divider class="my-5"></v-divider>

          <!-- Logout item -->
          <v-list-item link @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
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
        // TODO
      }
    }
  }
</script>