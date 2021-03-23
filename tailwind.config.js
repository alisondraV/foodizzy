module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
  plugins: []
};
