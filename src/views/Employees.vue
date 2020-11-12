<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="getData"
      sort-by="order"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Employee
              </v-btn>
            </template>
            <validation-observer ref="formEdit" v-slot="{ invalid, handleSubmit }">
              <v-form @submit.prevent="handleSubmit(save)">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="2">
                          <v-avatar-uploader
                            :url="getAvatar"
                            :request="setAvatar"
                            @success="successAvatar"
                            :avatar="{size: 56}"
                            inputAccept="image/jpeg,image/png,image/bmp,image/gif"
                          />
                        </v-col>
                        <v-col cols="12" md="5">
                          <validation-provider v-slot="{ errors }" name="First Name" rules="required">
                            <v-text-field
                              v-model="editedItem.first_name"
                              label="First Name"
                              :error-messages="errors"
                              required
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="5">
                          <validation-provider v-slot="{ errors }" name="Last Name" rules="required">
                            <v-text-field
                              v-model="editedItem.last_name"
                              label="Last Name"
                              :error-messages="errors"
                              required
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12">
                          <validation-provider v-slot="{ errors }" name="Department" rules="required">
                            <v-select
                              v-model="editedItem.department_id"
                              :items="departments"
                              label="Department"
                              item-text="name"
                              item-value="id"
                              :error-messages="errors"
                              required
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.phone"
                            label="Phone"
                            hide-details
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.position"
                            label="Position"
                            hide-details
                          ></v-text-field>
                        </v-col>
                         <v-col cols="12">
                          <v-textarea
                            v-model="editedItem.comment"
                            clearable
                            clear-icon="mdi-close-circle"
                            label="Comment"
                            rows="3"
                            hide-details
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-checkbox
                            v-model="editedItem.activated"
                            label="Active"
                            type="checkbox"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-container>
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
      <template v-slot:item.avatar="{ item }">
        <v-avatar v-if="item.avatar" size="56">
          <v-img :src="'/storage/' + item.avatar"></v-img>
        </v-avatar>
      </template>
      <template v-slot:item.activated="{ item }">
        <v-icon v-if="item.activated" color="success">mdi-check-circle-outline</v-icon>
        <v-icon v-else color="error">mdi-checkbox-blank-circle-outline</v-icon>
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
import VAvatarUploader from '@/components/VAvatarUploader';

import { required } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

export default {
  name: "Employees",
  components: {
    ValidationProvider,
    ValidationObserver,
    VAvatarUploader,
  },
  data: () => ({
    //
    dialog: false,
    headers: [
      {
        text: 'Avatar',
        align: 'start',
        sortable: false,
        value: 'avatar',
        width: 90
      },
      { text: 'Full Name', value: 'full_name' },
      { text: 'Department', value: 'department.name' },
      { text: 'Phone', value: 'phone', width: 200 },
      { text: 'Position', value: 'position', width: 200 },
      { text: 'Activ.', value: 'activated', align: 'center', width: 100 },
      { text: 'Actions', value: 'actions', sortable: false, align: 'end', width: 100 },
    ],
    editedIndex: -1,
    editedItem: {
      department_id: null,
      first_name: '',
      last_name: '',
      phone: '',
      position: '',
      comment: '',
      avatar: null,
      activated: true,
    },
    defaultItem: {
      department_id: null,
      first_name: '',
      last_name: '',
      phone: '',
      position: '',
      comment: '',
      avatar: null,
      activated: true,
    },
  }),
  computed: {
    ...mapGetters("employee", ["getData"]),
    ...mapGetters({departments: "department/getData"}),
    formTitle() {
      return this.editedIndex === -1 ? 'New Employee' : 'Edit Employee'
    },
    getAvatar() {
      var avatar = "";
      if (this.editedItem.avatar) {
        avatar = '/storage/' + this.editedItem.avatar;
      }
      return avatar;
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted() {
    this.fetchData();
    this.fetchDepartments();
  },
  methods: {
    ...mapActions("employee", ["fetchData", "storeData", "updateData", "deleteData", "uploadAvatar"]),
    ...mapActions({fetchDepartments: "department/fetchData"}),
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
        this.$refs.formEdit.reset()
      })
    },

    save() {
      if (!this.$refs.formEdit.validate())
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
    setAvatar(form, config) {
      return this.uploadAvatar(form);
    },
    successAvatar(data) {
      this.editedItem.avatar = data.file_name;
    }
  }
};
</script>
