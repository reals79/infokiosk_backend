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
                New Document
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
                          <v-document-uploader
                            :url="getDocumentType()"
                            :request="setDocumentFile"
                            @success="successDocumentFile"
                            :avatar="{size: 56}"
                            :maxSize=5000
                            inputAccept="application/pdf,image/jpeg,image/png,image/gif"
                          />
                        </v-col>
                        <v-col cols="12" md="10">
                          <validation-provider v-slot="{ errors }" name="Name" rules="required">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name"
                              :error-messages="errors"
                              required
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12">
                          <validation-provider v-slot="{ errors }" name="Category" rules="required">
                            <v-select
                              v-model="editedItem.category_id"
                              :items="categories"
                              label="Category"
                              item-text="name"
                              item-value="id"
                              :error-messages="errors"
                              required
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="editedItem.description"
                            clearable
                            clear-icon="mdi-close-circle"
                            label="Description"
                            rows="3"
                            hide-details
                          ></v-textarea>
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
      <template v-slot:item.file="{ item }">
        <v-btn
          v-if="item.file"
          color="blue-grey"
          class="ma-2 white--text"
          @click="downloadFile(item.file)"
          x-small
        >
          Download
          <v-icon
            right
            dark
            x-small
          >
            mdi-download
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.file_mimetype="{ item }">
          <v-img v-if="item.file_mimetype" :src="getDocumentType(item.file_mimetype)" width="24"></v-img>
      </template>
      <template v-slot:item.file_size="{ item }">
          {{ Number(item.file_size) | prettyBytes }}
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
import VDocumentUploader from '@/components/VDocumentUploader';

import { required } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

export default {
  name: "Documents",
  components: {
    ValidationProvider,
    ValidationObserver,
    VDocumentUploader,
  },
  data: () => ({
    //
    dialog: false,
    headers: [
      {
        text: 'Document',
        align: 'start',
        sortable: false,
        value: 'file',
        width: 90
      },
      { text: 'Name', value: 'name' },
      { text: 'Category', value: 'category.name' },
      { text: 'File Type', value: 'file_mimetype', align: 'center', width: 100 },
      { text: 'File Size', value: 'file_size', width: 200 },
      { text: 'Activ.', value: 'activated', align: 'center', width: 100 },
      { text: 'Actions', value: 'actions', sortable: false, align: 'end', width: 100 },
    ],
    editedIndex: -1,
    editedItem: {
      category_id: null,
      name: '',
      description: '',
      comment: '',
      file: '',
      file_mimetype: '',
      file_size: '',
      activated: true,
    },
    defaultItem: {
      category_id: null,
      name: '',
      description: '',
      comment: '',
      file: '',
      file_mimetype: '',
      file_size: '',
      activated: true,
    },
  }),
  computed: {
    ...mapGetters("document", ["getData"]),
    ...mapGetters({categories: "category/getData"}),
    formTitle() {
      return this.editedIndex === -1 ? 'New Document' : 'Edit Document'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted() {
    this.fetchData();
    this.fetchCategories();
  },
  methods: {
    ...mapActions("document", ["fetchData", "storeData", "updateData", "deleteData", "uploadDocumentFile"]),
    ...mapActions({fetchCategories: "category/fetchData"}),
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
    setDocumentFile(form, config) {
      return this.uploadDocumentFile(form);
    },
    successDocumentFile(data) {
      this.editedItem.file = data.file_name;
      this.editedItem.file_mimetype = data.file_type;
      this.editedItem.file_size = data.file_size;
    },
    getDocumentType(type) {
      var document_type = "";
      type = type || this.editedItem.file_mimetype;
      if (type) {
        document_type = require('@/assets/type_unknown.png');
        if (type == 'application/pdf') {
          document_type = require('@/assets/type_pdf.png');
        } else if (type == 'image/jpeg') {
          document_type = require('@/assets/type_jpg.png');
        } else if (type == 'image/png') {
          document_type = require('@/assets/type_png.png');
        } else if (type == 'image/gif') {
          document_type = require('@/assets/type_gif.png');
        }
      }
      return document_type;
    },
    downloadFile(file) {
      this.axios({
            url: '/download/' + file,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
              var fileName = response.headers['content-filename'];
              var fileURL = window.URL.createObjectURL(new Blob([response.data]));
              var fileLink = document.createElement('a');

              fileLink.href = fileURL;
              fileLink.setAttribute('download', fileName);
              document.body.appendChild(fileLink);

              fileLink.click();
        });
    }
  }
};
</script>
