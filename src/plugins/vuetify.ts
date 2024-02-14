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
          surface: '#18181F', // 282833;  $back-base color - default cards, btn, lists bg (old #141d26)
          surface2: '#282833',
          myBlack: '#070709',
          primary: '#4200FF',
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
