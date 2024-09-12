// uno.config.ts
import presetWind from '@unocss/preset-wind'

import {
  defineConfig,
  presetTypography,
  presetWebFonts,
} from 'unocss'


export default defineConfig({

  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    }
  },
  presets: [
    presetTypography(),
    presetWind(),
    presetWebFonts({
      fonts: {
        geo: 'Geologica',
        mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    }),
  ],
  transformers: [

  ],
})