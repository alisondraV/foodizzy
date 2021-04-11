module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    customForms: theme => ({
      default: {
        select: {
          borderRadius: theme('borderRadius.md'),
          borderColor: theme('borderColor.secondary-text'),
          icon:
            '<svg width="18" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M16 2L9 6L2 2" stroke="#01877E" stroke-width="1.1" stroke-linecap="square"/></svg>'
        }
      }
    }),
    colors: {
      'primary-green': '#01877E',
      'primary-peach': '#FFB0A9',
      'light-green': '#B6DDDA',
      'light-yellow': '#FFE6A3',
      'dark-green': '#13313D',
      'dark-yellow': '#D0AA45',
      'light-peach': '#FFE9E7',
      'dark-peach': '#D98B84',
      'primary-yellow': '#F9D678',
      'light-grey': '#E7E7E7',
      'primary-text': '#383838',
      'secondary-text': '#9A9A9C',
      background: '#FFFFFFFF'
    },
    extend: {
      fontSize: {
        header: '1.4rem',
        'small-header': '1.2rem',
        'header-onboarding': '1.75rem'
      },
      screens: {
        xs: '375px'
      },
      spacing: {
        progress: '0.16rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/custom-forms')]
};
