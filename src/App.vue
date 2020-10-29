<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <MFieldEditor v-model="config" :fixed-fields="fixedFields" />
      <v-divider />
      <h2>Current Settings</h2>
      <v-textarea v-model="configJson" auto-grow />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@vue/composition-api";
import Vue from "vue";
import MFieldEditor from "./components/MFieldEditor.vue";
import sampleAttrs from "./sampleAttrs.json";
import sampleFields from "./sampleFields.json";

export default defineComponent({
  name: "App",

  components: {
    MFieldEditor
  },

  setup() {
    const config = ref({ attr: sampleAttrs, field: sampleFields.fields });
    const configJson = computed({
      get: () => JSON.stringify(config, null, "  "),
      set(v) {
        config.value = JSON.parse(v);
      }
    });
    return {
      fixedFields: [],

      config,
      configJson
    };
  }
});
</script>
