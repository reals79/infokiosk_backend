<template>
  <v-container>
    <v-card class="mx-auto mb-16" max-width="350">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @keydown.enter.native.prevent="login"
      >
        <v-alert
          v-if="$store.state.message"
          dense
          outlined
          type="error"
          class="mb-0"
        >
          {{ $store.state.message }}
        </v-alert>
        <v-card-title>Авторизация</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="username"
            :rules="required"
            label="Логин"
            required
            autofocus
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="required"
            label="Пароль"
            type="password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            :loading="$store.state.loading"
            :disabled="!valid || $store.state.loading"
            color="success"
            @click="login"
          >
            Войти
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Login",

  components: {},

  data: () => ({
    valid: false,
    username: "",
    password: "",
    required: [v => !!v || "Field is required"]
  }),
  methods: {
    login() {
      this.$store.state.message = "";
      this.$store.state.loading = true;
      const { username, password } = this;
      this.$store.dispatch("auth/login", { username, password }).then(
        () => {
          this.$store.state.loading = false;
          this.$router.push("/").catch(() => {});
        },
        error => {
          this.$store.state.loading = false;
          this.$store.state.message =
            (error.response && error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    }
  }
};
</script>
