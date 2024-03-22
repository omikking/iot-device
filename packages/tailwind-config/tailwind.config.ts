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
    // extend: {},
  },
  plugins: [],
};
export default config;
