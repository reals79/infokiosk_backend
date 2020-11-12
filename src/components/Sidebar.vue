<template>
  <v-navigation-drawer clipped app permanent id="main-sidebar">
    <v-list dense nav>
      <!---Sidebar Items -->
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        :active-class="`green darken-2 white--text`"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!---Sidebar Items -->

      <v-list-group
        :value="true"
        prepend-icon="mdi-format-list-bulleted"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Catalogs</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(catalog, i) in catalogs"
          :key="i"
          :to="catalog.to"
          :active-class="`green darken-2 white--text`"
          link
        >
          <v-list-item-icon v-if="catalog.icon">
            <v-icon>{{ catalog.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="catalog.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  data: () => ({
    items: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/"
      },
      {
        title: "Slideshow",
        icon: "mdi-play-box-outline",
        to: "/slideshows"
      },
      {
        title: "Employees",
        icon: "mdi-account-group",
        to: "/employees"
      },
      {
        title: "Documents",
        icon: "mdi-file-document-multiple-outline",
        to: "/documents"
      },
    ],
    catalogs: [
      {
        title: "Employee Departments",
        to: "/departments"
      },
      {
        title: "Document Categories",
        to: "/categories"
      }
    ]
  }),
  methods: {}
};
</script>
<style lang="scss">
#main-sidebar {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .v-navigation-drawer__border {
    display: none;
  }
  .v-list {
    padding: 8px 15px;
  }
  .v-list-item {
    &__icon--text,
    &__icon:first-child {
      justify-content: center;
      text-align: center;
      width: 20px;
    }
  }
}
</style>
