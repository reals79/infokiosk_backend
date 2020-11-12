<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="getData"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="400px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Department
              </v-btn>
            </template>
            <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
              <v-form @submit.prevent="handleSubmit(save)">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <validation-provider v-slot="{ errors }" name="Name" rules="required">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                        :error-messages="errors"
                        required
                      ></v-text-field>
                    </validation-provider>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      :disabled="invalid"
                      type="submit"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </validation-observer>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-icon color="orange" large>mdi-information</v-icon>
        <p>No data here!</p>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions } from "vuex";

import { required } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

export default {
  name: "Departments",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    //
    dialog: false,
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'end', width: 100 },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),
  computed: {
    ...mapGetters("department", ["getData"]),
    formTitle () {
      return this.editedIndex === -1 ? 'New Department' : 'Edit Department'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions("department", ["fetchData", "storeData", "updateData", "deleteData"]),
    editItem(item) {
      this.editedIndex = this.getData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const res = await this.$dialog.confirm({
        text: "Are you sure you want to delete this item?",
        title: "Warning",
        type: "warning"
      });
      if (res) {
        this.deleteData(item)
        .then(() => {
          this.fetchData();
        });
      }
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (!this.$refs.observer.validate())
        return;

      if (this.editedIndex > -1) {
        this.updateData(this.editedItem)
        .then(() => {
          this.fetchData();
        });
      } else {
        this.storeData(this.editedItem)
        .then(() => {
          this.fetchData();
        });
      }
      this.close()
    },
  }
};
</script>
