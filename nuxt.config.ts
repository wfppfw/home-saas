/* eslint-disable node/prefer-global/process */
import { pwa } from './app/config/pwa'
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    'nuxt-icon',
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@nuxtjs/color-mode',
  ],
  devtools: {
    enabled: true,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {

      viewport: 'width=device-width,initial-scale=1',
      link: [
        {
          rel: 'preload',
          href: '/fonts/OpenSans-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/FiraCode-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/moon.svg' },
        { rel: 'apple-touch-icon', href: '/moon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#020618' },
      ],
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        },

        // Object syntax can be used to override default options
        remarkPlugins: {
          // Override remark-emoji options
          'remark-emoji': {
            options: {
              emoticon: true,
            },
          },
          // Disable remark-gfm
          'remark-gfm': false,
          // Add remark-oembed
          'remark-oembed': {
            // Options
          },
        },

        highlight: {
          // Theme used in all color schemes.
          // OR
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai',
          },
          // 默认包括['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml']
          langs: [
            'c',
            'cpp',
            'java',
          ],
        },
      },

    },

  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    // public: {
    //   apiBase: '/api'
    // }
  },
  build: {
    transpile: [
      '@codemirror/theme-dracula',
      'codemirror',
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/language',
      '@codemirror/commands',
    ],
    // transpile: [
    //   'markdown-it',
    //   'highlight.js/lib/core',
    //   'highlight.js/lib/languages/javascript',
    //   'highlight.js/lib/languages/typescript',
    //   'highlight.js/lib/languages/python',
    //   'highlight.js/lib/languages/bash',
    //   'highlight.js/lib/languages/xml',
    // ],
  },
  devServer: {
  },

  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false, // 禁用预加载提取
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    // preset: 'service-worker', // 启用Service Worker缓存
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
    experimental: {
      websocket: true,
    },
  },
  vite: {
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    optimizeDeps: {

      include: [
        '@codemirror/lang-javascript',
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@webcontainer/api',
        'highlight.js',
        'highlight.js/lib/core',
        'highlight.js/lib/languages/javascript',
        'highlight.js/lib/languages/typescript',
        'highlight.js/lib/languages/python',
        'highlight.js/lib/languages/bash',
        'highlight.js/lib/languages/xml', // html 使用 xml 语言包
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  pwa,

  unocss: {
    theme: {
      colors: {
        // 添加暗色模式支持
        dark: {
          primary: '#81A1C1',
          background: '#2E3440',
          surface: '#3B4252',
        },
      },
    },
    safelist: [
      // 主题相关类
      'cm-theme-dark',
      'cm-theme-dracula',
      // 自定义选择器
      '[&_.cm-gutters]:bg-gray-50',
      'dark:[&_.cm-gutters]:bg-gray-800',
      // CodeMirror 核心类
      'cm-editor',
      'cm-gutters',
      'cm-lineNumbers',
      'cm-activeLine',

      // 匹配所有 cm- 前缀类
      'cm-*',

      // 特殊字符类
      '',
      '',
      // 语法标记类
      'cm-keyword',
      'cm-comment',
      'cm-string',
      'cm-number',

      // 折叠图标
      'codicon-chevron-down',
      'codicon-chevron-right',
    ],
  },
})
