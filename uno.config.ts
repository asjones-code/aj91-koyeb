// uno.config.ts
import presetWind from '@unocss/preset-wind'
import { presetFluid } from 'unocss-preset-fluid'

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
    presetFluid({
      maxWidth: 1440,
      minWidth: 375,
      extendMaxWidth: null,
      extendMinWidth: null,
      remBase: 16,
      useRemByDefault: false,
      ranges: null,
      commentHelpers: false,
    }),
    presetTypography(),
    presetWind(),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        geo: [
          {
            name: 'Geologica',
            weights: ['400', '700'],
            italic: true,
            provider: 'google',
          },

        ],
        tabular: [
          {
            name: 'Tabular',
            weights: ['100', '400', '700'],
            italic: false,
            provider: 'fontshare',
          },

        ],
        outfit: [
          {
            name: 'Outfit',
            weights: ['100', '300', '400', '700', '900'],
            italic: false,
            provider: 'fontshare',
          },
        ],
        technor: [
          {
            name: 'Technor',
            weights: ['100', '300', '400', '700', '900'],
            italic: false,
            provider: 'fontshare',
          },

        ],
          excon: ['Excon', 'Excon:100,300,400,700,900'],
          mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    },

    ),
  ],
  transformers: [

  ],
})