/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      container: {
        center: true
      },
      textColor: {
        skin: {
          base: withOpacity("--text-color-base"),
          accent: withOpacity("--text-color-accent"),
        }
      },
      backgroundColor: {
        skin: {
          base: withOpacity("--background-color-base"),
          card: withOpacity("--background-color-card"),
        }
      },
      fontFamily: {
        sans: ['Fira Sans Condensed', 'sans-serif']
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            a: {
              color: 'rgb(var(--text-color-accent))',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
