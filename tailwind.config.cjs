const plugin = require('tailwindcss/plugin');

// Generate at: https://uicolors.app
const theme = {
  'primary': {
    '50': '#f1f8fd',
    '100': '#deeffb',
    '200': '#c5e5f8',
    '300': '#9dd6f3',
    '400': '#6fbeeb',
    '500': '#5aa9e6',
    '600': '#3888d8',
    '700': '#2f73c6',
    '800': '#2c5da1',
    '900': '#284f80',
    '950': '#1d314e',
    'DEFAULT': '#5aa9e6',
  },
  'on-primary': {
    '500': '#ffffff',
    'DEFAULT': '#ffffff',
  },
  'secondary': {
    '50': '#fefce8',
    '100': '#fff9c2',
    '200': '#fff089',
    '300': '#ffe45e',
    '400': '#fdcc12',
    '500': '#ecb206',
    '600': '#cc8902',
    '700': '#a36105',
    '800': '#864c0d',
    '900': '#723e11',
    '950': '#431f05',
    'DEFAULT': '#ffe45e',
  },
  'on-secondary': {
    '500': '#ffffff',
    'DEFAULT': '#ffffff',
  },
};

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
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
  darkMode: [
    'class',
    '[data-theme="dark"]'
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      scale: {
        '97': '0.97',
        '98': '0.98',
        '99': '0.99'
      },
      opacity: {
        '12': '0.12',
        '38': '0.38',
        '87': '0.87'
      },
      container: {
        center: true,
        padding: {
          'DEFAULT': '1rem',
          'xl': '2.5rem',
          '2xl': '8rem'
        },
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '50': '12.5rem',
        '90': '22.5rem'
      },
      extendedSpacing: {
        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        // Bigger values
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
        '132': '33rem',
        '140': '35rem',
        '160': '40rem',
        '180': '45rem',
        '192': '48rem',
        '200': '50rem',
        '240': '60rem',
        '256': '64rem',
        '280': '70rem',
        '320': '80rem',
        '360': '90rem',
        '400': '100rem',
        '480': '120rem'
      },
      fontSize: {
        '3xl': ['1.875rem', '2.5rem'],
        '4xl': ['2.25rem', '2.75rem']
      },
      maxWidth: ({theme}) => ({
        ...theme('spacing'),
        ...theme('extendedSpacing'),
      }),
      minWidth: theme => ({
        ...theme('spacing')
      }),
      minHeight: theme => ({
        ...theme('spacing')
      }),
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--text-default) !important',
            maxWidth: 'unset',

            strong: {
              fontWeight: '700',
            },

            img: {
              borderRadius: '0.5rem',
              width: 'auto',
            },

            figure: {
              display: 'flex',
              justifyContent: 'center',
            },
          },
        },
      }),
    }
  },
  plugins: [
    require('daisyui'),
    require("@tailwindcss/typography"),

    plugin(
      ({matchUtilities, theme}) => {
        matchUtilities(
          {
            'icon-size': (value) => ({
              width: value,
              height: value,
              minWidth: value,
              minHeight: value,
              fontSize: value,
              lineHeight: value,
            }),
          },
          {
            values: theme('iconSize'),
          }
        );
      },
      {
        theme: {
          iconSize: {
            3: '0.75rem',
            3.5: '0.875rem',
            4: '1rem',
            4.5: '1.125rem',
            5: '1.25rem',
            6: '1.5rem',
            7: '1.75rem',
            8: '2rem',
            10: '2.5rem',
            12: '3rem',
            14: '3.5rem',
            16: '4rem',
            18: '4.5rem',
            20: '5rem',
            22: '5.5rem',
            24: '6rem',
          },
        },
      }
    ),
  ],
  daisyui: {
    styled: true,
    base: false,
    utils: true,
    logs: false,
    rtl: false,
    darkTheme: 'dark',
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          'primary': theme['primary']['DEFAULT'],
          'primary-content': theme['on-primary']['DEFAULT'],
          'secondary': theme['secondary']['DEFAULT'],
          'secondary-content': theme['on-secondary']['DEFAULT'],
          'accent': '#FFBC42',
          'accent-content': '#FFFFFF',
          'neutral': '#D1D5DB',
          'neutral-content': '#FFFFFF',
          'info-content': '#FFFFFF',
          'warning-content': '#FFFFFF',
          'base-100': '#FFFFFF',
          'base-200': '#F5F5F5',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          'primary': theme['primary']['DEFAULT'],
          'primary-content': theme['on-primary']['DEFAULT'],
          'secondary': theme['secondary']['DEFAULT'],
          'secondary-content': theme['on-secondary']['DEFAULT'],
          'accent': '#FFBC42',
          'accent-content': '#FFFFFF',
          'neutral': '#D1D5DB',
          'neutral-content': '#FFFFFF',
          'info-content': '#FFFFFF',
          'warning-content': '#FFFFFF',
          'base-100': '#111827',
          'base-200': '#1F2937',
        },
      }
    ]
  }
};
