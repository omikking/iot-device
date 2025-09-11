import type { Config } from 'tailwindcss';

// We want each package to be responsible for its own content.
const config: Omit<Config, 'content'> = {
  theme: {
    fontFamily: {
      'sandvik-text': ['SandvikSansText', 'sans-serif'],
      'sandvik-headline': ['SandvikSansHeadline', 'sans-serif'],
    },
    fontWeight: {
      light: 200,
      regular: 400,
      bold: 700,
      extrabold: 800,
    },

    extend: {
      fontSize: {
        xs: '0.75rem' /* 12px */,
        sm: '0.875rem' /* 14px */,
        md: '1rem' /* 16px */,
        xl: '1.25rem' /* 20px */,
        '2xl': '1.5rem' /* 24px */,
        '3xl': '2rem' /* 32px */,
        '4xl': '3.375rem' /* 54px */,
      },
      spacing: {
        xl: '128px',
        lg: '64px',
        md: '32px',
        sm: '16px',
      },
      colors: {
        /* The main colors shall be used for headlines and all texts, securing the relevant contrast. 
        White is also a key background fill. For dark backgrounds, use Neutral-9! */
        'main-black': '#101010',
        'main-white': '#FFFFFF',

        // neutral-primary
        'neutral-1': '#F8F8F8',
        'neutral-2': '#E6E6E6',
        // also used for disabled color
        'neutral-3': '#DADADA',
        'neutral-4': '#9D9D9D',
        'neutral-5': '#6F6F6F',
        'neutral-6': '#575757',
        'neutral-7': '#434343',
        'neutral-8': '#242424',
        'neutral-9': '#1B1B1B',

        /* Sandvik Group content Highlights in the page header */
        'gold-primary': '#A08C64',
        'gold-1': '#73644B',
        'gold-2': '#BEAF93',
        'gold-3': '#EBE6DC',

        /* CTAs Buttons Badges Alerts */
        'blue-primary': '#1441F5',
        'blue-1': '#003C7D',
        'blue-2': '#327DFF',
        'blue-3': '#E7ECFE',

        error: '#EB0D0D',
        'error-3': '#FDE7E7',

        success: '#7FCC5B',
        'success-3': '#ECF7E6',

        warning: '#FFD74B',
        'warning-3': '#FEFDE9',

        /* Highlights in product pages Progress bars Steppers Timelines 
        Active toggles Attention grabbing toast cards */
        'orange-primary': '#F54B00',
        'orange-1': '#7D2300',
        'orange-2': '#FF824B',
        'orange-3': '#FFB991',
      },
    },
  },
  plugins: [],
};
export default config;
