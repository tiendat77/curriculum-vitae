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
      minWidth: theme => ({
        ...theme('spacing')
      }),
      minHeight: theme => ({
        ...theme('spacing')
      }),
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch'
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
