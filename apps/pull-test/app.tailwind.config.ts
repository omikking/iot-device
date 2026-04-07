// tailwind config is required for editor support
//For react native "tailwind.config.ts"

import type { Config } from 'tailwindcss';
import sharedConfig from '@gsp/tailwind-config';
import type { PluginAPI } from 'tailwindcss/types/config';
import plugin from 'tailwindcss/plugin';

const config: Pick<Config, 'content' | 'presets' | 'theme' | 'plugins'> = {
  content: ['./src/app/**/*.tsx'],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontSize: {
        caption: '10px',
        footnote: '10px',
        // 'button-lg': '14px',
        // 'button-md': '12px',
        '3xl': '64px',
        '2xl': '56px',
        xl: '40px',
        lg: '32px',
        md: '24px',
        sm: '20px',
        xs: '16px',
      },
      lineHeight: {
        caption: '160%',
        footnote: '160%',
        // 'button-lg': '125%',
        // 'button-md': '150%',
        '3xl': '100%',
        '2xl': '100%',
        xl: '105%',
        lg: '110%',
        md: '120%',
        sm: '125%',
        xs: '125%',
      },
      letterSpacing: {
        caption: '0em',
        footnote: '0em',
        // 'button-lg': '0em',
        // 'button-md': '0em',
        '3xl': '-0.01em',
        '2xl': '-0.01em',
        xl: '-0.01em',
        lg: '-0.0em',
        md: '-0.0em',
        sm: '-0.0em',
        xs: '-0.01em',
      },
      relativeSize: {},
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.body-intro': {
          fontSize: '28px',
          lineHeight: '115%',
          letterSpacing: '0em',
        },
        '.body-lg': {
          fontSize: '20px',
          lineHeight: '125%',
          letterSpacing: '0em',
        },
        '.body-md': {
          fontSize: '16px',
          lineHeight: '140%',
          letterSpacing: '0em',
        },
        '.body-sm': {
          fontSize: '12px',
          lineHeight: '150%',
          letterSpacing: '0em',
        },
      });
    }),
  ],
};

export default config;
