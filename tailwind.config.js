const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Tailwind configuration
 */
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,scss,ts,js,jsx,tsx}'],
  important: true,
  theme: {
    fontSize: {
      'xs': '0.625rem',
      'sm': '0.75rem',
      'md': '0.8125rem',
      'base': '0.875rem',
      'lg': '1rem',
      'xl': '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '2.25rem',
      '6xl': '2.5rem',
      '7xl': '3rem',
      '8xl': '4rem',
      '9xl': '6rem',
      '10xl': '8rem'
    },
    screens: {
      'sm': '600px',
      'md': '960px',
      'lg': '1280px',
      'xl': '1440px',
      '2xl': '1536px',
      '3xl': '1920px'
    },
    extend: {
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to left, rgba(22, 28, 36, 0.24), rgba(22, 28, 36, 0.8), #161C24)',
        'gradient-to-top-black': 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
        'gradient-to-bottom-black': 'linear-gradient(to bottom, rgba(0, 0, 0, 1), transparent)',
        'ticket-bg-top': "url('assets/icons/tickets/background-1.svg')",
        'ticeket-bg-middle': "url('./assets/icons/tickets/background-2.svg')",
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slideIn': 'slideIn 0.7s ease-out',
      },
      borderWidth: {
        '1': '1px'
      },
      colors: {
        primary: {
          DEFAULT: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#0b7feb"
        },
        accent: {
          DEFAULT: "#2E58A6"
        },
        warn: {
          ...colors.red,
          DEFAULT: colors.red[600]
        },
        transparent: 'transparent',
        black: {
          DEFAULT: colors.black[600]
        },
        white: {
          DEFAULT: colors.white
        },
        gray: {
          DEFAULT: colors.gray[600]
        }
      },
      flex: {
        '0': '0 0 auto',
        '25': '0 0 25%',
        '33': '0 0 33%',
        '49': '0 0 49%',
        '49.5': '0 0 49.5%',
        '50': '0 0 50%',
        '100': '0 0 100%'
      },
      fontFamily: {
        sans: ['"Neuropa"', ...defaultTheme.fontFamily.sans],
        serif: ['"Graphik"', ...defaultTheme.fontFamily.serif],
        inter: ['Inter', 'sans-serif']
      },
      opacity: {
        12: '0.12',
        38: '0.38',
        87: '0.87'
      },
      rotate: {
        '-270': '270deg',
        '15': '15deg',
        '30': '30deg',
        '60': '60deg',
        '270': '270deg'
      },
      scale: {
        '-1': '-1'
      },
      zIndex: {
        '-1': -1,
        '49': 49,
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '99': 99,
        '999': 999,
        '9999': 9999,
        '99999': 99999
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '50': '12.5rem',
        '90': '22.5rem',

        // Bigger values
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
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
        '480': '120rem',

        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '2/5': '40%',
      },
      // minHeight               : ({theme}) => ({
      //     ...theme('spacing')
      // }),
      maxHeight: {
        none: 'none'
      },
      minWidth: ({ theme }) => ({
        ...theme('spacing'),
        screen: '100vw'
      }),
      maxWidth: ({ theme }) => ({
        ...theme('spacing'),
        screen: '100vw'
      }),
      transitionDuration: {
        '400': '400ms'
      },
      transitionTimingFunction: {
        'drawer': 'cubic-bezier(0.25, 0.8, 0.25, 1)'
      },
    }
  },
  corePlugins: {
    appearance: false,
    container: false,
    float: false,
    clear: false,
    placeholderColor: false,
    placeholderOpacity: false
  },
  plugins: [
    // Other third party and/or custom plugins
    require('@tailwindcss/typography')({ modifiers: ['sm', 'lg'] }),
    require('tailwind-scrollbar-hide')
  ]
};

module.exports = config;


