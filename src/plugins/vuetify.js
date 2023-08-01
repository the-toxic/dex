import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
// import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',

    themes: {
      dark: {
        colors: {
          surface: '#141d26', // default color btn bg
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
  // icons: {
  //   defaultSet: 'mdi',
  //   aliases,
  //   sets: {
  //     mdi,
  //   },
  // },
})
