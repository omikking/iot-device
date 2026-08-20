// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@gsp/tailwind-config';
import type { PluginAPI } from 'tailwindcss/types/config';
const plugin = require('tailwindcss/plugin');

const config: Pick<
  Config,
  'content' | 'presets' | 'theme' | 'plugins' | 'prefix'
> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
  prefix: 'ui-banshee-',
  theme: {
    extend: {
      fontSize: {
        caption: '10px',
        footnote: '10px',
        'button-lg': '14px',
        'button-md': '12px',
        '3xl': '140px',
        '2xl': '104px',
        xl: '80px',
        lg: '56px',
        md: '40px',
        sm: '24px',
        xs: '16px',
      },
      lineHeight: {
        caption: '160%',
        footnote: '160%',
        'button-lg': '125%',
        'button-md': '150%',
        '3xl': '100%',
        '2xl': '100%',
        xl: '100%',
        lg: '105%',
        md: '110%',
        sm: '120%',
        xs: '125%',
      },
      letterSpacing: {
        caption: '0em',
        footnote: '0em',
        'button-lg': '0em',
        'button-md': '0em',
        '3xl': '-0.02em',
        '2xl': '-0.02em',
        xl: '-0.01em',
        lg: '-0.01em',
        md: '-0.00em',
        sm: '-0.00em',
        xs: '-0.01em',
      },
      relativeSize: {},
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.body-intro': {
          fontSize: '48px',
          lineHeight: '110%',
          letterSpacing: '-0.01em',
        },
        '.body-lg': {
          fontSize: '32px',
          lineHeight: '120%',
          letterSpacing: '0.0em',
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
