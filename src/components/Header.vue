<template>
  <v-app-bar app clipped-left clipped-right color="green darken-4" dark>
    <v-toolbar-title class="d-flex align-center">
      <span><v-img src="../assets/logo.png" width="50"></v-img></span>
      <span class="ml-4">InfoKiosk Admin</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="isAuthenticated">
      <v-btn icon @click.prevent="logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data: () => ({}),
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    }
  }
};
</script>
