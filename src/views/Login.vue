<template>
  <v-app id="inspire">
    <v-overlay :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-main>
      <v-container class="fill-height overline" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="10" lg="7">
            <v-row align="center" justify="center">
              <img src="@/assets/logo.png" alt="Santa's Hat" width="225" height="225"/>
              <span class="text-h3 overline">Santa's Secret</span>
            </v-row>

            <v-row align="center" justify="center">
              <span class="overline">Auto arranged Secret Santa matches</span>
            </v-row>
            
            <br>
          
            <v-card class="elevation-7">
                  <v-tabs v-model="tab">
                    <v-tabs-slider color="secondary"></v-tabs-slider>
                    <v-tab>Login</v-tab>
                    <v-spacer></v-spacer>
                    <v-tab>Register</v-tab>
                  </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card flat>

                    <!-- Login tab -->
                    <v-card-text>
                      <v-form ref="loginForm" v-model="loginFormValidation">
                        <v-text-field
                          label="E-mail"
                          name="email"
                          v-model="login_email"
                          prepend-icon="mdi-account-circle"
                          type="text"
                          required
                          :rules="emailRules">
                        </v-text-field>

                        <v-text-field
                          label="Password"
                          name="password"
                          v-model="login_password"
                          prepend-icon="mdi-lock"
                          type="password"
                          required
                          :rules="passwordRules">
                        </v-text-field>

                        <v-card-actions>
                          <v-btn @click="passwordResetDialog = true" color="white">Password Recovery</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn :disabled="!loginFormValidation" @click="login" color="secondary">Login</v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- Register tab -->
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-form ref="registerForm" v-model="registerFormValidation">
                        <v-text-field
                          label="Name"
                          name="name"
                          v-model="register_name"
                          type="text"
                          required
                          :rules="nameRules">
                        </v-text-field>
                        <v-text-field
                          label="Last name"
                          name="lastName"
                          v-model="register_last_name"
                          type="text"
                          required
                          :rules="lastNameRules">
                        </v-text-field>

                        <v-text-field
                          label="E-mail"
                          name="email"
                          v-model="register_email"
                          type="text"
                          required
                          :rules="emailRules">
                        </v-text-field>

                        <v-divider></v-divider>

                        <v-text-field
                          label="Password"
                          name="password"
                          v-model="register_password"
                          type="password"
                          required
                          :rules="passwordRules">
                        </v-text-field>
                        <v-text-field
                          label="Password confirmation"
                          name="passwordConfirmation"
                          v-model="register_password_confirmation"
                          type="password"
                          required
                          :rules="passwordRules">
                        </v-text-field>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn :disabled="!registerFormValidation" @click="register" color="secondary">Create Account</v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>

          </v-col>
        </v-row>
      </v-container>

      <!-- Password reset dialog-->
      <v-dialog v-model="passwordResetDialog" persistent max-width="500">
        <v-card class="overline">
          <v-card-title class="headline">Password Recovery</v-card-title>
          <v-card-text>
            Insert your e-mail to recover or change your password.
            <v-text-field
              v-model="emailPasswordReset"
              label="E-mail"
              required
              :rules="emailRules">
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="dark" text @click="passwordResetDialog = false">Cancel</v-btn>
            <v-btn color="dark" text @click="sendResetEmail(emailPasswordReset)">Send recovery e-mail</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import firebase from '@/database'

export default {
  created () {
    this.$vuetify.theme.dark = false
  },
  data () {
    return {
      tab: null,
      loginFormValidation: true,
      registerFormValidation: true,

      loader: false,

      register_name: '',
      register_last_name: '',
      register_email: '',
      register_password: '',
      register_password_confirmation: '',

      login_email: '',
      login_password: '',

      passwordResetDialog: false,
      emailPasswordReset: '',

      emailRules: [
        v => !!v || 'E-mail must be provided.',
        v => /^[^\s].+@.+\..+[^\s]$/.test(v) || 'Must provide a valid e-mail.'
      ],
      passwordRules: [
        v => !!v || 'Password must be provided.'
      ],
      nameRules: [
        v => !!v || 'Name must be provided.'
      ],
      lastNameRules: [
        v => !!v || 'Last name must be provided.'
      ]

    }
  },
  methods: {
    register() {
      let that = this
      that.loader = true
      this.$refs.registerForm.validate() &&
      firebase
        .auth()
        .createUserWithEmailAndPassword(that.register_email, that.register_password)
        .then(data => {
          firebase.firestore().collection("users").doc(data.user.uid).set({
            name: that.register_name,
            last_name: that.register_last_name,
            birth: ''
          })
          that.loader = false
          alert("Account created.")
          that.$router.replace('home')
        })
        .catch(error => {
          that.loader = false
          alert(error.message)
        });
    },
    login () {
      let that = this
      that.loader = true
      
      this.$refs.loginForm.validate() &&
      firebase
        .auth()
        .signInWithEmailAndPassword(that.login_email, that.login_password)
        .then(() => {
          that.loader = false
          that.$router.replace('home')
        })
        .catch(function (error) {
          var errorCode = error.code
          var errorMessage = error.message

          if (errorCode === 'auth/invalid-email') {
            alert('Must provide a valid e-mail.')
          } else if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.')
          } else {
            alert(errorCode + ' - ' + errorMessage)
          }
          that.loader = false
        })
    },
    sendResetEmail (email) {
      firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('E-mail de recuperação enviado.')
      }).catch(function (error) {
        alert(error)
      })
      this.passwordResetDialog = false
    }
  }
}
</script>
