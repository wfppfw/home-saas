import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['cursor-pointer', 'cursor-my-pointer'],
    ['chat-container', 'p-6 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-xl'],
    ['bubble-group', 'flex flex-col gap-4 items-start [&>.bubble-root]:hover:z-10'],
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  rules: [
    ['text-nav-color', { 'font-size': '1.25rem', 'color': 'oklch(.554 .046 257.417)' }],
    ['ease-bubble', { 'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)' }],
    ['bubble-shadow', {
      'box-shadow': '0 3px 20px -5px rgba(0, 0, 0, 0.1)',
    }],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      bubble: {
        primary: 'rgba(var(--bubble-primary), %alpha)',
        secondary: 'rgba(var(--bubble-secondary), %alpha)',
      },
    },
  },
})
