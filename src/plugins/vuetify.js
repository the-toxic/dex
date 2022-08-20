import Vue from 'vue';

// For full framework
// import Vuetify from 'vuetify/lib/framework';
// For a-la-carte components - https://vuetifyjs.com/en/customization/a-la-carte/
import Vuetify from 'vuetify/lib';

import * as directives from 'vuetify/lib/directives'

Vue.use(Vuetify, { directives });

export default new Vuetify({
  theme: {
    dark: true,
    // options: { variations: false }, // disable generate 9 sub-colors for all colors
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        // background: '#05090c', // not work, need change in styles/vuetify_variables/_dark.scss
        // surface: '#111b27',
        // primary: '#FFCB12', // '#264706', // '#099809',
        // secondary: '#829099',
        // accent: '#82B1FF',
        // error: '#FF5252',
        // info: '#2196F3',
        // success: '#4CAF50',
        // warning: '#FFC107',
        // myGreen: '#264706',
      },
    },
  },
});
