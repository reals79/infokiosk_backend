<template>
  <v-app>
    <Header></Header>
    <Sidebar v-if="isAuthenticated"></Sidebar>

    <v-main>
      <v-container class="fill-height align-start" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import { mapGetters } from "vuex";

export default {
  name: "App",

  components: {
    Header,
    Sidebar
  },

  data: () => ({
    //
  }),
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  }
};
</script>
