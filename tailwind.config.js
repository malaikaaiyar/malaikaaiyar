/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/pages/**/*.{astro,js,ts,jsx,tsx}',
    './src/layouts/**/*.{astro,js,ts,jsx,tsx}',
    './src/components/**/*.{astro,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Redaction 35', 'serif'],
        'sans': ['Redaction Regular', 'serif'],
      },
      colors: {
        'custom-cream': '#F6F2E9',
        'custom-amber': '#433525',
      },
      height: {
        'screen-minus-header': 'calc(100vh - 60px)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontFamily: `${theme('fontFamily.heading')} !important`,
              color: theme('colors.custom-amber'),
              fontWeight: "normal",
              marginTop: '0.5em',
              marginBottom: '0.25em',
            },
            h2: {
              fontFamily: `${theme('fontFamily.heading')} !important`,
              color: theme('colors.custom-amber'),
              fontWeight: "normal",
              marginTop: '0.5em',
              marginBottom: '0.25em',
              fontSize: '2.5rem',
              lineHeight: '3rem',
            },
            h3: {
              fontFamily: `${theme('fontFamily.heading')} !important`,
              color: theme('colors.custom-amber'),
              fontWeight: "normal",
              marginTop: '0.5em',
              marginBottom: '0.25em',
            },
            'em': {
              fontStyle: 'italic',
            },
          },
        },
        'custom': {
          css: {
            h1: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.custom-amber'),
              marginTop: '0.5em',
              marginBottom: '0.25em',
            },
            h2: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.custom-amber'),
              marginTop: '0.5em',
              marginBottom: '0.25em',
            },
            h3: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.custom-amber'),
              marginTop: '0.5em',
              marginBottom: '0.25em',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

