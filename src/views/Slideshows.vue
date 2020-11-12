<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="getData"
      sort-by="order"
      class="elevation-1"
      v-sortable-table
      @sorted="objectSortOccurred"
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
                New Slide
              </v-btn>
            </template>
            <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
              <v-form @submit.prevent="handleSubmit(save)">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <validation-provider v-slot="{ errors }" name="Title" rules="required">
                      <v-text-field
                        v-model="editedItem.title"
                        label="Title"
                        :error-messages="errors"
                        required
                      ></v-text-field>
                    </validation-provider>
                    <validation-provider v-if="editedIndex == -1" v-slot="{ errors }" name="Cover" rules="required">
                      <v-file-input
                        v-model="editedItem.cover"
                        accept="image/*"
                        label="Cover"
                        :error-messages="errors"
                        required
                      ></v-file-input>
                    </validation-provider>
                    <v-checkbox
                      v-model="editedItem.activated"
                      label="Active"
                      type="checkbox"
                    ></v-checkbox>
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
      <template v-slot:item.order="{ item }">
        <v-icon
            :data-id="item.id"
            class="sortHandle"
            style="cursor: move"
            >mdi-drag
        </v-icon>
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
      <template v-slot:item.cover="{ item }">
        <v-img :src="'/storage/' + item.cover" max-height="100" max-width="100"></v-img>
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

import { required } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import Sortable from "sortablejs";

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

export default {
  name: "Slideshows",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    //
    dialog: false,
    headers: [
      {
          text: "",
          value: "order",
          align: "center",
          width: 36,
          sortable: false
      },
      {
        text: 'Cover',
        align: 'start',
        sortable: false,
        value: 'cover',
        width: 200
      },
      { text: 'Title', value: 'title' },
      { text: 'Activ.', value: 'activated', align: 'center', width: 100 },
      { text: 'Actions', value: 'actions', sortable: false, align: 'end', width: 100 },
    ],
    editedIndex: -1,
    editedItem: {
      title: '',
      cover: null,
      activated: true,
    },
    defaultItem: {
      title: '',
      cover: null,
      activated: true,
    },
  }),
  directives: {
      sortableTable: {
          bind(el, binding, vnode) {
              const options = {
                  handle: ".sortHandle",
                  filter: ".v-row-group__header",
                  draggable: "tr",
                  animation: 150,
                  onMove: function(evt, originalEvent) {
                      let dragged = evt.dragged.getElementsByClassName(
                          "sortHandle"
                      )[0];
                      let related = evt.related.getElementsByClassName(
                          "sortHandle"
                      )[0];
                      if (related && related.dataset) {
                          return dragged.dataset.type == related.dataset.type;
                      }
                      return false;
                  },
                  onUpdate: function(evt) {
                      vnode.child.$emit("sorted", evt);
                  }
              };
              Sortable.create(el.getElementsByTagName("tbody")[0], options);
          }
      }
  },
  computed: {
    ...mapGetters("slideshow", ["getData"]),
    formTitle () {
      return this.editedIndex === -1 ? 'New Slide' : 'Edit Slide'
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
    ...mapActions("slideshow", ["fetchData", "storeData", "updateData", "deleteData"]),
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
        let formData = new FormData();
        formData.append('title', this.editedItem.title);
        formData.append('cover', this.editedItem.cover);
        formData.append('activated', this.editedItem.activated);

        this.storeData(formData)
        .then(() => {
          this.fetchData();
        });
      }
      this.close()
    },

    objectSortOccurred({ item, oldIndex, newIndex }) {
        let obj = item.getElementsByClassName("sortHandle")[0];
        const moved = this.getData.splice(oldIndex, 1)[0];
        this.getData.splice(newIndex, 0, moved);
        let ids = this.$_.map(this.getData, "id");
        this.axios.post("/api/admin/slideshow/order", { list: ids }).then(result => {});
    }
  }
};
</script>
