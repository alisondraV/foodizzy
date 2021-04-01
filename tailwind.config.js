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
      'primary-yellow': '#F9D678',
      'light-green': '#B6DDDA',
      'dark-green': '#13313D',
      'light-peach': '#FFE9E7',
      'dark-peach': '#D98B84',
      'dark-yellow': '#D0AA45',
      'light-yellow': '#FFE6A3',
      'light-grey': '#E7E7E7',
      'primary-text': '#383838',
      'secondary-text': '#9A9A9C',
      background: '#FFFFFFFF'
    },
    extend: {
      fontSize: {
        header: '1.4rem',
        'header-onboarding': '1.75rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/custom-forms')]
};
