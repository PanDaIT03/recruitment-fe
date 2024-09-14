/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          0: '#000000',
          10: '#001423',
          20: '#001D34',
          30: '#002745',
          40: '#003056',
          50: '#00538F',
          60: '#0077CC',
          70: '#0A99FF',
          80: '#33AAFF',
          90: '#5CBBFF',
          95: '#ADDDFF',
          99: '#ADDDFF',
          100: '#FFFFFF',
        },
        secondary: {
          10: '#3C2D16',
          20: '#77592C',
          30: '#956F37',
          40: '#BD904C',
          50: '#C9A46D',
          60: '#D3B588',
          70: '#D8BE97',
          80: '#DDC7A6',
          90: '#E9DAC4',
          95: '#EBE4D6',
          99: '#F8F6F1',
          100: '#FFFFFF',
        },
        error: {
          10: '#410E0B',
          20: '#601410',
          30: '#8C1D18',
          40: '#B3261E',
          50: '#DC362E',
          60: '#E46962',
          70: '#EC928E',
          80: '#F2B8B5',
          90: '#F9DEDC',
          95: '#FCEEEE',
          99: '#FFFBF9',
          100: '#FFFFFF',
        },

        neutral: {
          10: '#1B1D1F',
          20: '#303133',
          30: '#464849',
          40: '#5D6062',
          50: '#757779',
          60: '#909294',
          70: '#AAACAE',
          80: '#C5C8CA',
          90: '#E1E3E6',
          95: '#EFF3F8',
          99: '#FBFDFF',
          100: '#FFFFFF',
        },
        'neutral-variant': {
          0: '#000000',
          10: '#21221A',
          20: '#37372F',
          30: '#4F4E45',
          40: '#66665D',
          50: '#7E7E74',
          60: '#99998F',
          70: '#B4B3A9',
          80: '#D0CFC4',
          90: '#ECECE0',
          95: '#FAFAEE',
          99: '#FFFEFB',
          100: '#FFFFFF',
        },
        outline: '#7E7E74', // neutral-variant-50
        background: '#E1E3E6', // neutral-90
        surface: '#FBFDFF', // neutral-99
        'on-error': '#FFFFFF', // 100
        'surface-variant': '#ECECE0', // neutral-variant-90
        'on-surface-variant': '#4F4E45', // neutral-variant-10
        'on-error-container': '#410E0B', // 10
        'on-background': '#1B1D1F', // neutral-10
        'on-surface': '#1B1E1F', // neutral-10
      },
      textColor: {
        main: '#fff',
        sub: '#78726de6',
        accent: '#f15224',
        dark: '#0A0A0A',
        warning: '#DC2626',
      },
      backgroundColor: {
        main: '#f7f6f2',
        'header-bgHover': '#461A53',
        'light-warning': '#fee2e2',
      },
    },
  },
  plugins: [],
};
